<?php
/**
 * Plugin Name:  ACE Cookie & Nonce Fix
 * Plugin URI:   https://dev-ask-construction-cost-estimator.pantheonsite.io
 * Description:  Fixes "Cookie check failed" error for the AI Construction Estimator on mobile and all devices.
 * Version:      1.3
 * Author:       ASK Realtors & Builders
 */
defined('ABSPATH') || exit;

// 1. Extend nonce lifetime to 24 hours (cached pages have stale nonces)
add_filter('nonce_life', fn() => 24 * HOUR_IN_SECONDS);

// 2. Fresh nonce REST endpoint (never cached)
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
            $resp->header('Surrogate-Control', 'no-store');
            return $resp;
        },
        'permission_callback' => '__return_true',
    ]);
});

// 3. No-cache headers on all /ace/v1/ REST responses
add_filter('rest_post_dispatch', function ($response, $server, $request) {
    if (str_contains($request->get_route(), '/ace/v1/')) {
        $response->header('Cache-Control',     'no-store, no-cache, must-revalidate, max-age=0');
        $response->header('Pragma',            'no-cache');
        $response->header('Surrogate-Control', 'no-store');
    }
    return $response;
}, 10, 3);

// 4. CORS headers so mobile browsers can reach the REST API
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

// 5. Intercept nopriv AJAX at priority 1 — inject a valid nonce so plugin's
//    check_ajax_referer() succeeds (runs before plugin at priority 10)
add_action('wp_loaded', function () {
    $actions = [
        'ace_calculate_estimate', 'ace_save_estimate',   'ace_generate_estimate',
        'ace_ai_estimate',        'ace_wizard_estimate',  'ace_estimator_calculate',
        'ace_estimator_save',     'ace_get_estimate',     'ace_estimator',
        'ace_calculate',
    ];
    foreach ($actions as $a) {
        add_action("wp_ajax_nopriv_{$a}", function () {
            $fresh = wp_create_nonce('ace_estimator');
            $_POST['nonce'] = $_POST['security'] = $_REQUEST['nonce'] = $fresh;
        }, 1);
        add_action("wp_ajax_{$a}", function () {
            $fresh = wp_create_nonce('ace_estimator');
            $_POST['nonce'] = $_POST['security'] = $_REQUEST['nonce'] = $fresh;
        }, 1);
    }
});

// 6. Inline JS: refresh nonce before every AJAX call on the estimator page
add_action('wp_footer', function () {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (!str_contains($uri, 'estimator') && !str_contains($uri, 'calculator')) return;
    $nonce_url = esc_js(rest_url('ace/v1/nonce'));
    ?>
<script id="ace-nonce-refresh">
(function(){
  var NONCE_URL='<?php echo $nonce_url; ?>';
  var _cache=null,_pending=null;

  function getNewNonce(){
    if(_pending) return _pending;
    _pending=fetch(NONCE_URL+'?_='+Date.now(),{cache:'no-store',credentials:'same-origin'})
      .then(function(r){return r.json();})
      .then(function(d){
        _cache=d; _pending=null;
        // Patch every known localization object the ACE plugin may use
        ['aceEstimator','ace_vars','aceData','aceL10n','aceSettings','ace_estimator_params',
         'aceParams','aceNonce','ace_ajax'].forEach(function(k){
          if(window[k]){
            if(d.ajax_nonce){window[k].nonce=d.ajax_nonce; window[k].security=d.ajax_nonce;}
            if(d.nonce)     {window[k].rest_nonce=d.nonce; window[k].wp_nonce=d.nonce;}
          }
        });
        return d;
      }).catch(function(){_pending=null; return null;});
    return _pending;
  }

  // Intercept fetch() → inject X-WP-Nonce header
  var _F=window.fetch;
  window.fetch=function(url,opts){
    opts=opts||{};
    var u=typeof url==='string'?url:(url&&url.url?url.url:'');
    var isAce=(u.indexOf('/ace/v1/')>-1||u.indexOf('admin-ajax.php')>-1)&&u.indexOf('/nonce')<0;
    if(isAce){
      return getNewNonce().then(function(d){
        if(d){
          var h=opts.headers||{};
          if(!(h instanceof Headers)){h['X-WP-Nonce']=d.nonce; opts.headers=h;}
        }
        return _F(url,opts);
      });
    }
    return _F(url,opts);
  };

  // Intercept XMLHttpRequest (admin-ajax.php)
  var _O=XMLHttpRequest.prototype.open, _S=XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open=function(m,u){this._u=u; return _O.apply(this,arguments);};
  XMLHttpRequest.prototype.send=function(body){
    var self=this, url=self._u||'';
    if(url.indexOf('admin-ajax.php')>-1){
      getNewNonce().then(function(d){
        if(d&&typeof body==='string'){
          body=body.replace(/\bnonce=[^&]*/,'nonce='+d.ajax_nonce)
                   .replace(/\bsecurity=[^&]*/,'security='+d.ajax_nonce);
          if(body.indexOf('nonce=')<0) body+='&nonce='+d.ajax_nonce;
        }
        _S.call(self,body);
      });
      return;
    }
    return _S.apply(this,arguments);
  };

  // Pre-fetch on load, refresh every 20 min
  document.addEventListener('DOMContentLoaded', getNewNonce);
  setInterval(getNewNonce, 20*60*1000);
})();
</script>
<?php
}, 999);
