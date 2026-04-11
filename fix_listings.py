content = open('listings.html', encoding='utf-8').read()
old = "  if (params.get('society')) document.getElementById('fSociety').value = params.get('society');\n  if (params.get('city')) document.getElementById('fCity').value = params.get('city');\n  if (params.get('size')) document.getElementById('fSize').value = params.get('size');"
new = "  if (params.get('city'))    document.getElementById('fCity').value    = params.get('city');\n  if (params.get('society')) document.getElementById('fSociety').value = params.get('society');\n  if (params.get('type'))    document.getElementById('fType').value    = params.get('type');\n  if (params.get('size'))    document.getElementById('fSize').value    = params.get('size');"
if old in content:
    content = content.replace(old, new)
    open('listings.html', 'w', encoding='utf-8').write(content)
    print('FIXED: type param now read from URL')
else:
    print('NOT FOUND - checking nearby text:')
    idx = content.find('fSociety')
    print(repr(content[max(0,idx-50):idx+200]))
