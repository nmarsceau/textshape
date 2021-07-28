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
    id: 'trim',
    options: [
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
    triggers: [
      {id: 'left_trim', display: 'Left Trim'},
      {id: 'trim', display: 'Trim'},
      {id: 'right_trim', display: 'Right Trim'}
    ],
    action: options => {
      let operator = 'trim';
      if (options.trigger === 'left_trim') {operator = 'trimStart';}
      else if (options.trigger === 'right_trim') {operator = 'trimEnd';}
      if (options.operand === 'entire_text') {
        text.value = text.value[operator]();
      }
      else if (options.operand === 'each_line') {
        text.value = forEachLine(line => line[operator]());
      }
    }
  },
  {
    id: 'add_text',
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
    triggers: [
      {id: 'prepend', display: 'Prepend'},
      {id: 'surround', display: 'Surround'},
      {id: 'append', display: 'Append'}
    ],
    action: options => {
      let leftCharacter, rightCharacter;
      switch (options.character) {
        case 'single_quotes':
          leftCharacter = "'"; rightCharacter = "'";
          break;
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
        default:
          leftCharacter = options.character; rightCharacter = options.character;
          break;
      }
      if (options.trigger === 'prepend') {
        text.value = forEachLine(line => `${leftCharacter}${line}`);
      }
      else if (options.trigger === 'append') {
        text.value = forEachLine(line => `${line}${rightCharacter}`);
      }
      else {
        text.value = forEachLine(line => `${leftCharacter}${line}${rightCharacter}`);
      }
    }
  },
  {
    id: 'split',
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
    triggers: [
      {id: 'split', display: 'Split'}
    ],
    action: options => {
      if (Array.isArray(options.character) && options.character.length > 0) {
        const optionsCharacterLookup = {
          comma: ',',
          space: ' ',
          tab: '\t'
        };
        const regexCharacters = ['\n'];
        const customStrings = [];
        for (const character of options.character) {
          if (optionsCharacterLookup.hasOwnProperty(character)) {
            regexCharacters.push(optionsCharacterLookup[character]);
          }
          else {
            customStrings.push(character);
          }
        }
        let regex = `[${regexCharacters.join('')}]`;
        for (const customString of customStrings) {
          regex += `|(?:${customString})`;
        }
        text.value = text.value.split(new RegExp(regex)).join('\n');
      }
    }
  },
  {
    id: 'join',
    options: [
      {
        name: 'character',
        type: 'radio',
        values: {
          comma: 'Comma',
          empty_string: 'Empty String',
          custom: 'Custom'
        },
        default: 'comma',
        inline: false
      }
    ],
    triggers: [
      {id: 'join', display: 'Join'}
    ],
    action: options => {
      let character;
      switch (options.character) {
        case 'comma':
          character = ',';
          break;
        case 'empty_string':
          character = '';
          break;
        default:
          character = options.character;
          break;
      }
      text.value = text.value.split('\n').join(character);
    }
  },
  {
    id: 'remove_unwanted_whitespace',
    options: null,
    triggers: [
      {id: 'remove_unwanted_whitespace', display: 'Remove<br>Unwanted<br>Whitespace'}
    ],
    action: () => {
      text.value = text.value.replace(/  +/gm, ' ');
    }
  },
  {
    id: 'reverse',
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
    triggers: [
      {id: 'reverse', display: 'Reverse'}
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
    id: 'replace',
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
    triggers: [
      {id: 'replace', display: 'Replace'}
    ],
    action: options => {
      if (options.find !== '') {
        text.value = text.value.replaceAll(options.find, options.replace);
      }
    }
  },
  {
    id: 'pad',
    options: [
      {
        name: 'length',
        label: 'Length',
        type: 'number',
        default: 5
      },
      {
        name: 'character',
        type: 'radio',
        values: {
          zero: 'Zero',
          space: 'Space',
          custom: 'Custom'
        },
        default: 'zero'
      }
    ],
    triggers: [
      {id: 'left_pad', display: 'Left Pad'},
      {id: 'right_pad', display: 'Right Pad'}
    ],
    action: options => {
      const padFunction = options.trigger === 'right_pad' ? 'padEnd' : 'padStart';
      if (options.character === 'zero') {options.character = '0';}
      else if (options.character === 'space') {options.character = ' ';}
      text.value = forEachLine(line => line[padFunction](options.length, options.character));
    }
  },
  {
    id: 'remove_duplicates',
    triggers: [
      {id: 'remove_duplicates', display: 'Remove<br>Duplicates'}
    ],
    action: () => {
      text.value = [...new Set(text.value.split('\n'))].join('\n');
    }
  },
  {
    id: 'shuffle',
    triggers: [
      {id: 'shuffle', display: 'Shuffle'}
    ],
    action: () => {
      const lines = text.value.split('\n');
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
      text.value = lines.join('\n');
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
    case 'number':
      return createNumberOption(toolId, option);
  }
}

function createRadioOption(toolId, option) {
  const optionContainer = document.createElement('div');
  for (const [value, display] of Object.entries(option.values)) {
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

    if (value === 'custom') {
      const customValueContainer = document.createElement('div');
      customValueContainer.hidden = true;

      const customValueInput = document.createElement('input');
      customValueInput.type = 'text';
      customValueInput.name = `${toolId}_${option.name}_custom_value`;

      customValueContainer.append(customValueInput);
      optionContainer.append(customValueContainer);
      optionContainer.addEventListener('change', () => customValueContainer.hidden = !optionInput.checked);
    }
  }
  return optionContainer;
}

function createCheckboxOption(toolId, option) {
  const optionContainer = document.createElement('div');
  for (const [value, display] of Object.entries(option.values)) {
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
    if (value === 'custom') {
      const customValueContainer = document.createElement('div');
      customValueContainer.hidden = true;

      const customValueInput = document.createElement('input');
      customValueInput.type = 'text';
      customValueInput.name = `${toolId}_${option.name}_custom_value`;

      customValueContainer.append(customValueInput);
      optionContainer.append(customValueContainer);
      optionInput.addEventListener('change', () => customValueContainer.hidden = !optionInput.checked);
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

function createNumberOption(toolId, option) {
  const optionContainer = document.createElement('div');
  const optionLabel = document.createElement('label');
  optionLabel.htmlFor = `${toolId}_${option.name}`;
  optionLabel.innerHTML = option.label;

  const optionInput = document.createElement('input');
  optionInput.type = 'number';
  optionInput.id = `${toolId}_${option.name}`;
  optionInput.name = `${toolId}_${option.name}`;
  if (typeof option.default === 'string') {
    option.default = Number(option.default);
  }
  if (typeof option.default === 'number' && !isNaN(option.default)) {
    optionInput.value = option.default;
  }

  optionContainer.append(optionLabel, document.createElement('br'), optionInput);
  if (option.inline === false) {
    optionContainer.append(document.createElement('br'));
  }
  return optionContainer;
}

function getToolOptions(toolConfig) {
  const options = {};
  if (Array.isArray(toolConfig.options)) {
    for (const option of toolConfig.options) {
      switch (option.type) {
        case 'radio':
          const selectedRadioOption = document.querySelector(`[name="${toolConfig.id}_${option.name}"]:checked`);
          if (selectedRadioOption === null) {options[option.name] = null;}
          else if (selectedRadioOption.value === 'custom') {
            const customRadioOption = document.querySelector(`[name="${toolConfig.id}_${option.name}_custom_value"]`);
            if (customRadioOption.value.trim() !== '') {
              options[option.name] = customRadioOption.value.trim();
            }
          }
          else {options[option.name] = selectedRadioOption.value;}
          break;
        case 'checkbox':
          const selectedCheckboxOptions = document.querySelectorAll(`[name="${toolConfig.id}_${option.name}"]:checked`);
          options[option.name] = [];
          if (selectedCheckboxOptions.length > 0) {
            for (const selectedOption of selectedCheckboxOptions) {
              if (selectedOption.value === 'custom') {
                const customCheckboxOption = document.querySelector(`[name="${toolConfig.id}_${option.name}_custom_value"]`);
                if (customCheckboxOption.value.trim() !== '') {
                  options[option.name].push(customCheckboxOption.value.trim());
                }
              }
              else {options[option.name].push(selectedOption.value);}
            }
          }
          break;
        case 'text':
        case 'number':
          options[option.name] = document.querySelector(`[name="${toolConfig.id}_${option.name}"]`).value;
          break;
      }
    }
  }
  return options;
}

function createToolButton(toolConfig, trigger) {
  const toolButton = document.createElement('button');
  toolButton.innerHTML = trigger.display;
  toolButton.triggerId = trigger.id;
  toolButton.addEventListener('click', event => {
    const options = getToolOptions(toolConfig);
    options.trigger = event.target.closest('button').triggerId;
    toolConfig.action(options);
  });
  return toolButton;
}

for (const toolConfig of toolsConfig) {
  const toolContainer = createToolContainer(toolConfig);
  if (Array.isArray(toolConfig.options)) {
    for (const option of toolConfig.options) {
      toolContainer.append(createOption(toolConfig.id, option));
    }
  }
  if (Array.isArray(toolConfig.triggers)) {
    const toolButtonContainer = document.createElement('div');
    for (const trigger of toolConfig.triggers) {
      toolButtonContainer.append(createToolButton(toolConfig, trigger));
    }
    toolContainer.append(toolButtonContainer);
  }
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
