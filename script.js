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
        type: 'choose_one',
        values: {
          left: 'Left',
          right: 'Right',
          both: 'Both'
        },
        default: 'both'
      },
      {
        name: 'operand',
        type: 'choose_one',
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
        type: 'choose_one',
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
    name: 'Join',
    options: [
      {
        name: 'character',
        type: 'choose_one',
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
    action: options => {
      while (text.value.includes('  ')) {
        text.value = text.value.replace('  ', ' ');
      }
    }
  },
  {
    name: 'Reverse',
    options: [
      {
        name: 'operator',
        type: 'choose_one',
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
];

for (const toolConfig of toolsConfig) {
  const toolId = toolConfig.name.toLowerCase().replace(' ', '_');
  const toolContainer = document.createElement('div');
  toolContainer.classList.add('tool-card');
  if (toolConfig.hasOwnProperty('class')) {
    toolContainer.classList.add(toolConfig.class);
  }
  if (Array.isArray(toolConfig.options)) {
    for (const option of toolConfig.options) {
      const toolRow = document.createElement('div');
      for (const [value, display] of Object.entries(option.values)) {
        if (value === 'custom') {continue;}
        const optionInput = document.createElement('input');
        optionInput.type = option.type === 'choose_one' ? 'radio' : 'checkbox';
        optionInput.id = toolId + '_' + option.name + '_' + value;
        optionInput.name = toolId + '_' + option.name;
        optionInput.value = value;
        if (
          (
            typeof option.default === 'string'
            && option.default === value
          )
          || (
            Array.isArray(option.default)
            && option.default.includes(value)
          )
        ) {
          optionInput.setAttribute('checked', 'checked');
        }
        const optionLabel = document.createElement('label');
        optionLabel.htmlFor = toolId + '_' + option.name + '_' + value;
        optionLabel.innerHTML = display;
        if (option.inline ?? true) {
          toolRow.append(optionInput, optionLabel);
        }
        else {
          const toolOptionContainer = document.createElement('div');
          toolOptionContainer.append(optionInput, optionLabel);
          toolRow.append(toolOptionContainer);
        }
      }
      toolContainer.append(toolRow);
    }
  }
  const toolButton = document.createElement('button');
  toolButton.innerHTML = toolConfig.name;
  toolButton.addEventListener('click', () => {
    const options = {};
    if (Array.isArray(toolConfig.options)) {
      for (const option of toolConfig.options) {
        const selected_options = document.querySelectorAll(`[name="${toolId}_${option.name}"]:checked`);
        if (selected_options.length > 0) {
          if (option.type === 'choose_one') {
            options[option.name] = selected_options[0].value;
          }
          else if (option.type === 'choose_many') {
            options[option.name] = [];
            for (const selected_option of selected_options) {
              options[option.name].push(selected_option.value);
            }
          }
        }
      }
    }
    toolConfig.action(options);
  });
  const toolButtonContainer = document.createElement('div');
  toolButtonContainer.append(toolButton);
  toolContainer.append(toolButtonContainer);
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

text.focus();