document.getElementById('selectClikeLanguage').style.visibility = 'hidden'

CodeMirror.modeURL = './node_modules/codemirror/mode/%N/%N.js'
var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true,
  extraKeys: {
    'Ctrl-Space': 'autocomplete'
  },
  autoCloseBrackets: true,
  autoCloseTags: true,
  highlightSelectionMatches: {
    showToken: /\w/
  }
})

var modeInput = document.getElementById('mode')
CodeMirror.on(modeInput, 'keypress', function(e) {
  if (e.keyCode == 13) change()
})

function change(val) {
  if (val == 'clike') {
    document.getElementById('selectClikeLanguage').style.visibility = 'visible'
  } else {
    document.getElementById('selectClikeLanguage').style.visibility = 'hidden'
  }

  var mode, spec
  if (/.+\.([^.]+)$/.exec(val)) {
    var result = /.+\.([^.]+)$/.exec(val)
    var info = CodeMirror.findModeByExtension(result[1])
    if (info) {
      mode = info.mode
      spec = info.mime
    }
  } else if (/\//.test(val)) {
    var info = CodeMirror.findModeByMIME(val)
    if (info) {
      mode = info.mode
      spec = val
    }
  } else {
    mode = spec = val
  }
  if (mode) {
    editor.setOption('mode', spec)
    CodeMirror.autoLoadMode(editor, mode)
    document.getElementById('modeinfo').textContent = spec
  } else {
    alert('Could not find a mode corresponding to ' + val)
  }
}

function setClikeMode(mode) {
  switch (mode) {
    case 'C':
      editor.setOption('mode', 'text/x-csrc')
      document.getElementById('modeinfo').textContent = 'C'
      break
    case 'C++':
      editor.setOption('mode', 'text/x-c++src')
      document.getElementById('modeinfo').textContent = 'C++'
      break
    case 'C#':
      editor.setOption('mode', 'text/x-csharp')
      document.getElementById('modeinfo').textContent = 'C#'
      break
    case 'Java':
      editor.setOption('mode', 'text/x-java')
      document.getElementById('modeinfo').textContent = 'Java'
      break
    case 'Obj C':
      editor.setOption('mode', 'text/x-objectivec')
      document.getElementById('modeinfo').textContent = 'Objective C'
      break
    case 'Scala':
      editor.setOption('mode', 'text/x-scala')
      document.getElementById('modeinfo').textContent = 'Scala'
      break
    case 'Kotlin':
      editor.setOption('mode', 'text/x-kotlin')
      document.getElementById('modeinfo').textContent = 'Kotlin'
      break
    case 'Ceylon':
      editor.setOption('mode', 'text/x-ceylon')
      document.getElementById('modeinfo').textContent = 'Ceylon'
      break
  }
}

var input = document.getElementById('select')

function selectTheme(theme) {
  editor.setOption('theme', theme)
  location.hash = '#' + theme
}
var choice = (location.hash && location.hash.slice(1)) ||
  (document.location.search &&
    decodeURIComponent(document.location.search.slice(1)))
if (choice) {
  input.value = choice
  selectTheme(choice)
}
CodeMirror.on(window, 'hashchange', function() {
  var theme = location.hash.slice(1)
  if (theme) {
    input.value = theme
    selectTheme(theme)
  }
})

function download(filename, text) {
  var pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  pom.setAttribute('download', filename);

  if (document.createEvent) {
    var event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    pom.dispatchEvent(event);
  } else {
    pom.click();
  }
  return text
}

function getExtension(mode) {
  switch (mode) {
    case 'javascript':
      return 'js'
    case 'text/x-java':
      return 'java'
    case 'htmlembedded':
    case 'htmlmixed':
      return 'html'
  }
}

function save() {
  var output = ''
  for (var i = 0; i < editor.lineCount(); i++) output += editor.getLine(i) + '\r\n'
  var filename = prompt('Filename', 'code.' + getExtension(editor.getOption('mode')))
  if (!filename) return null
  return download(filename, output)
}

window.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && String.fromCharCode(event.which).toLowerCase() == 's') {
      event.preventDefault()
      save()
    }
})

change('javascript')
