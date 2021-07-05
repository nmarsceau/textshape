function forEachLine(action) {
  if (typeof action === 'function') {
    const lines = text.value.split('\n');
    const newLines = [];
    for (const line of lines) {
      newLines.push(action(line));
    }
    return newLines.join('\n');
  }
  else {return text.value;}
}

const text = document.getElementById('text');
const tools = document.getElementById('tools');
const toolsConfig = [
  {
    name: 'Trim',
    options: [
      {
        name: 'operator',
        type: 'radio',
        values: {
          left: 'Left',
          right: 'Right',
          both: 'Both'
        },
        default: 'both'
      },
      {
        name: 'operand',
        type: 'radio',
        values: {
          each_line: 'Each Line',
          entire_text: 'Entire Text'
        },
        default: 'each_line'
      }
    ],
    action: options => {
      let operator = 'trim';
      if (options.operator === 'left') {operator = 'trimStart';}
      else if (options.operator === 'right') {operator = 'trimEnd';}
      if (options.operand === 'entire_text') {
        text.value = text.value[operator]();
      }
      else if (options.operand === 'each_line') {
        text.value = forEachLine(line => line[operator]());
      }
    }
  },
  {
    name: 'Surround',
    class: 'tall',
    options: [
      {
        name: 'character',
        type: 'radio',
        values: {
          single_quotes: 'Single Quotes',
          double_quotes: 'Double Quotes',
          parentheses: 'Parentheses',
          brackets: 'Brackets',
          curly_braces: 'Curly Braces',
          angle_brackets: 'Angle Brackets',
          custom: 'Custom'
        },
        default: 'single_quotes',
        inline: false
      }
    ],
    action: options => {
      let leftCharacter, rightCharacter;
      switch (options.character) {
        case 'double_quotes':
          leftCharacter = '"'; rightCharacter = '"';
          break;
        case 'parentheses':
          leftCharacter = '('; rightCharacter = ')';
          break;
        case 'brackets':
          leftCharacter = '['; rightCharacter = ']';
          break;
        case 'curly_braces':
          leftCharacter = '{'; rightCharacter = '}';
          break;
        case 'angle_brackets':
          leftCharacter = '<'; rightCharacter = '>';
          break;
        case 'custom':
          // TODO
          break;
        default:
          leftCharacter = "'"; rightCharacter = "'";
          break;
      }
      text.value = forEachLine(line => `${leftCharacter}${line}${rightCharacter}`);
    }
  },
  {
    name: 'Split',
    class: 'tall',
    options: [
      {
        name: 'character',
        type: 'checkbox',
        values: {
          comma: 'Comma',
          space: 'Space',
          tab: 'Tab',
          custom: 'Custom'
        },
        default: [
          'comma',
          'space',
          'tab'
        ],
        inline: false
      }
    ],
    action: options => {
      if (Array.isArray(options.character) && options.character.length > 0) {
        const optionsCharacterLookup = {
          comma: ',',
          space: ' ',
          tab: '\t'
        };
        const regexCharacters = ['\n'];
        for (const character of options.character) {
          regexCharacters.push(optionsCharacterLookup[character]);
        }
        const regex = new RegExp('[' + regexCharacters.join('') + ']');
        text.value = text.value.split(regex).join('\n');
      }
    }
  },
  {
    name: 'Join',
    options: [
      {
        name: 'character',
        type: 'radio',
        values: {
          comma: 'Comma',
          empty_string: 'Empty String',
          custom: 'Custom'
        },
        default: 'comma'
      }
    ],
    action: options => {
      let character;
      switch (options.character) {
        case 'empty_string':
          character = '';
          break;
        case 'custom':
          // TODO
          break;
        default:
          character = ',';
          break;
      }
      text.value = text.value.split('\n').join(character);
    }
  },
  {
    name: 'Remove Unwanted Whitespace',
    class: 'wide',
    options: null,
    action: () => {
      text.value = text.value.replace(/  +/gm, ' ');
    }
  },
  {
    name: 'Reverse',
    options: [
      {
        name: 'operator',
        type: 'radio',
        values: {
          lines: 'Reverse lines',
          text_in_line: 'Reverse text in each line'
        },
        default: 'lines',
        inline: false
      }
    ],
    action: options => {
      if (options.operator === 'lines') {
        text.value = text.value.split('\n').reverse().join('\n');
      }
      else if (options.operator === 'text_in_line') {
        text.value = forEachLine(line => line.split('').reverse().join(''));
      }
    }
  },
  {
    name: 'Replace',
    class: 'tall',
    options: [
      {
        name: 'find',
        label: 'Find',
        type: 'text'
      },
      {
        name: 'replace',
        label: 'Replace',
        type: 'text'
      }
    ],
    action: options => {
      if (options.find !== '') {
        text.value = text.value.replaceAll(options.find, options.replace);
      }
    }
  }
];

function createToolContainer(toolConfig) {
  const toolContainer = document.createElement('div');
  toolContainer.classList.add('tool-card');
  if (toolConfig.hasOwnProperty('class')) {
    toolContainer.classList.add(toolConfig.class);
  }
  return toolContainer;
}

function createOption(toolId, option) {
  switch (option.type) {
    case 'radio':
      return createRadioOption(toolId, option);
    case 'checkbox':
      return createCheckboxOption(toolId, option);
    case 'text':
      return createTextOption(toolId, option);
  }
}

function createRadioOption(toolId, option) {
  const optionContainer = document.createElement('div');
  for (const [value, display] of Object.entries(option.values)) {
    if (value === 'custom') {continue;}
    const optionInput = document.createElement('input');
    optionInput.type = 'radio';
    optionInput.id = `${toolId}_${option.name}_${value}`;
    optionInput.name = `${toolId}_${option.name}`;
    optionInput.value = value;
    if (typeof option.default === 'string' && option.default === value) {
      optionInput.setAttribute('checked', 'checked');
    }

    const optionLabel = document.createElement('label');
    optionLabel.htmlFor = `${toolId}_${option.name}_${value}`;
    optionLabel.innerHTML = display;

    optionContainer.append(optionInput, optionLabel);
    if (option.inline === false) {
      optionContainer.append(document.createElement('br'));
    }
  }
  return optionContainer;
}

function createCheckboxOption(toolId, option) {
  const optionContainer = document.createElement('div');
  for (const [value, display] of Object.entries(option.values)) {
    if (value === 'custom') {continue;}
    const optionInput = document.createElement('input');
    optionInput.type = 'checkbox';
    optionInput.id = `${toolId}_${option.name}_${value}`;
    optionInput.name = `${toolId}_${option.name}`;
    optionInput.value = value;
    if (Array.isArray(option.default) && option.default.includes(value)) {
      optionInput.setAttribute('checked', 'checked');
    }

    const optionLabel = document.createElement('label');
    optionLabel.htmlFor = `${toolId}_${option.name}_${value}`;
    optionLabel.innerHTML = display;

    optionContainer.append(optionInput, optionLabel);
    if (option.inline === false) {
      optionContainer.append(document.createElement('br'));
    }
  }
  return optionContainer;
}

function createTextOption(toolId, option) {
  const optionContainer = document.createElement('div');
  const optionLabel = document.createElement('label');
  optionLabel.htmlFor = `${toolId}_${option.name}`;
  optionLabel.innerHTML = option.label;

  const optionInput = document.createElement('input');
  optionInput.type = 'text';
  optionInput.id = `${toolId}_${option.name}`;
  optionInput.name = `${toolId}_${option.name}`;
  if (typeof option.default === 'string') {
    optionInput.value = option.default;
  }

  optionContainer.append(optionLabel, document.createElement('br'), optionInput);
  if (option.inline === false) {
    optionContainer.append(document.createElement('br'));
  }
  return optionContainer;
}

function getToolOptions(toolId, toolConfig) {
  const options = {};
  if (Array.isArray(toolConfig.options)) {
    for (const option of toolConfig.options) {
      switch (option.type) {
        case 'radio':
          const selectedRadioOptions = document.querySelectorAll(`[name="${toolId}_${option.name}"]:checked`);
          options[option.name] = selectedRadioOptions.length > 0 ? selectedRadioOptions[0].value : null;
          break;
        case 'checkbox':
          const selectedCheckboxOptions = document.querySelectorAll(`[name="${toolId}_${option.name}"]:checked`);
          options[option.name] = [];
          if (selectedCheckboxOptions.length > 0) {
            for (const selectedOption of selectedCheckboxOptions) {
              options[option.name].push(selectedOption.value);
            }
          }
          break;
        case 'text':
          options[option.name] = document.querySelector(`[name="${toolId}_${option.name}"]`).value;
          break;
      }
    }
  }
  return options;
}

function createToolButton(toolId, toolConfig) {
  const toolButton = document.createElement('button');
  toolButton.innerHTML = toolConfig.name;
  toolButton.addEventListener('click', () => toolConfig.action(getToolOptions(toolId, toolConfig)));
  const toolButtonContainer = document.createElement('div');
  toolButtonContainer.append(toolButton);
  return toolButtonContainer;
}

for (const toolConfig of toolsConfig) {
  const toolId = toolConfig.name.toLowerCase().replace(' ', '_');
  const toolContainer = createToolContainer(toolConfig);
  if (Array.isArray(toolConfig.options)) {
    for (const option of toolConfig.options) {
      toolContainer.append(createOption(toolId, option));
    }
  }
  toolContainer.append(createToolButton(toolId, toolConfig));
  tools.append(toolContainer);
}

const copy = document.getElementById('copy');
copy.addEventListener('click', () => {
  text.select();
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
  copy.classList.add('success');
  setTimeout(() => copy.classList.remove('success'), 3000);
});

const clear = document.getElementById('clear');
clear.addEventListener('click', () => {
  text.value = '';
});

text.focus();
