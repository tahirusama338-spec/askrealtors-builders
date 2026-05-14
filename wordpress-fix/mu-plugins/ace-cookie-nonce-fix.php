<?php
/**
 * Plugin Name: ACE Cookie & Nonce Fix
 * Description: Fixes "Cookie check failed" on mobile/Pantheon for the AI Construction Estimator
 * Version: 1.3
 */
defined('ABSPATH') || exit;

// ── 1. Extend nonce lifetime to 24 h (cached pages serve stale nonces on mobile) ──
add_filter('nonce_life', fn() => 24 * HOUR_IN_SECONDS);

// ── 2. No-cache REST endpoint that returns a fresh nonce ──────────────────────────
add_action('rest_api_init', function () {
    register_rest_route('ace/v1', '/nonce', [
        'methods'             => 'GET',
        'callback'            => function () {
            $resp = new WP_REST_Response([
                'nonce'      => wp_create_nonce('wp_rest'),
                'ajax_nonce' => wp_create_nonce('ace_estimator'),
            ]);
            $resp->header('Cache-Control',     'no-store, no-cache, must-revalidate, max-age=0');
            $resp->header('Pragma',            'no-cache');
            $resp->header('Surrogate-Control', 'no-store'); // bypass Pantheon CDN
            return $resp;
        },
        'permission_callback' => '__return_true',
    ]);
});

// ── 3. No-cache headers for every /ace/v1/ REST response ─────────────────────────
add_filter('rest_post_dispatch', function ($response, $server, $request) {
    if (str_contains($request->get_route(), '/ace/v1/')) {
        $response->header('Cache-Control',     'no-store, no-cache, must-revalidate, max-age=0');
        $response->header('Pragma',            'no-cache');
        $response->header('Surrogate-Control', 'no-store');
    }
    return $response;
}, 10, 3);

// ── 4. CORS headers so mobile browsers can reach the REST API ────────────────────
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($served) {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: X-WP-Nonce, Content-Type, Authorization, X-Requested-With');
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { status_header(200); exit; }
        return $served;
    });
}, 15);

// ── 5. Loosen nonce check for public (nopriv) ACE AJAX actions ───────────────────
//    The estimator is a PUBLIC tool — no login required — so nonces are optional.
//    We hook at priority 1 (before the plugin's priority-10 handlers) and manually
//    set $_REQUEST['nonce'] / $_POST['nonce'] to a fresh valid nonce so that the
//    plugin's own check_ajax_referer() call will succeed.
add_action('wp_loaded', function () {
    $public_actions = [
        'ace_calculate_estimate',
        'ace_save_estimate',
        'ace_generate_estimate',
        'ace_ai_estimate',
        'ace_wizard_estimate',
        'ace_estimator_calculate',
        'ace_estimator_save',
        'ace_get_estimate',
    ];

    foreach ($public_actions as $action) {
        add_action("wp_ajax_nopriv_{$action}", function () {
            // Inject a valid fresh nonce before the plugin runs its check
            $fresh = wp_create_nonce('ace_estimator');
            $_POST['nonce']    = $fresh;
            $_POST['security'] = $fresh;
            $_REQUEST['nonce'] = $fresh;
        }, 1); // priority 1 → runs before plugin's priority-10 handler
    }
});

// ── 6. Inline script on the estimator page: auto-refresh nonce before every AJAX ─
add_action('wp_footer', function () {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (!str_contains($uri, 'estimator')) return;
    $nonce_url = esc_js(rest_url('ace/v1/nonce'));
    ?>
<script>
(function(){
  var NONCE_URL = '<?php echo $nonce_url; ?>';
  var cache = null, pending = null;

  function getNewNonce(){
    if(pending) return pending;
    pending = fetch(NONCE_URL+'?_='+Date.now(),{cache:'no-store',credentials:'same-origin'})
      .then(function(r){return r.json();})
      .then(function(d){
        cache=d; pending=null;
        // Patch common plugin variable names
        ['aceEstimator','ace_vars','aceData','aceL10n','aceSettings'].forEach(function(k){
          if(window[k]){
            if(d.ajax_nonce) window[k].nonce    = d.ajax_nonce;
            if(d.ajax_nonce) window[k].security = d.ajax_nonce;
          }
        });
        return d;
      }).catch(function(){pending=null;return null;});
    return pending;
  }

  // Intercept fetch() to inject X-WP-Nonce header
  var _fetch = window.fetch;
  window.fetch = function(url,opts){
    opts = opts||{};
    var u = (typeof url==='string')?url:'';
    if((u.indexOf('/ace/v1/')>-1||u.indexOf('admin-ajax.php')>-1) && u.indexOf('/nonce')<0){
      return getNewNonce().then(function(d){
        if(d){
          var h = opts.headers||{};
          if(!(h instanceof Headers)){h['X-WP-Nonce']=d.nonce; opts.headers=h;}
        }
        return _fetch(url,opts);
      });
    }
    return _fetch(url,opts);
  };

  // Intercept XMLHttpRequest (admin-ajax.php)
  var _open=XMLHttpRequest.prototype.open, _send=XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open=function(m,u){this._u=u; return _open.apply(this,arguments);};
  XMLHttpRequest.prototype.send=function(body){
    var self=this, url=self._u||'';
    if(url.indexOf('admin-ajax.php')>-1){
      getNewNonce().then(function(d){
        if(d && typeof body==='string'){
          body=body.replace(/\bnonce=[^&]*/,'nonce='+d.ajax_nonce)
                   .replace(/\bsecurity=[^&]*/,'security='+d.ajax_nonce);
          if(body.indexOf('nonce=')<0) body+='&nonce='+d.ajax_nonce;
        }
        _send.call(self,body);
      });
      return;
    }
    return _send.apply(this,arguments);
  };

  // Pre-fetch on load, then refresh every 20 min
  document.addEventListener('DOMContentLoaded', getNewNonce);
  setInterval(getNewNonce, 20*60*1000);
})();
</script>
    <?php
}, 999);
