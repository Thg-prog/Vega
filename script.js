let accumulator = new Decimal(0); // Сумматор
let keyboardRegister = new Decimal(0); // Регистр клавиатуры
let multiplierRegister = new Decimal(0); // Регистр множителя
let currentInput = ''; // Ввод с клавиатуры
let operation = null; // Текущая операция
let expression = ''; // Строка для отображения выражения
let signalPFlag = false; // Флаг для сигнала П
let signalZFlag = false; // Флаг для сигнала З
let isTypingSecondNumber = false; // Флаг для проверки, вводится ли второе число
let isNegative = false;
let isFirst = true;
let flagZ=false;
const maxNumber= Decimal.pow(10,35)
let conversionResult = ""; // Строка для хранения результата конвертации
let currentIndex = 0; // Индекс текущего символа для вывода
Decimal.set({toExpNeg:-100, toExpPos: 100});
document.getElementById('expression-display').innerHTML = '<span>0</span>';

const slider = document.querySelector('slider-container .switch input[type="checkbox"]');
// Обновление дисплеев
function updateDisplays() {
  document.getElementById('keyboard-display').innerText = `К: ${keyboardRegister}`;
  document.getElementById('accumulator-display').innerText = `С: ${accumulator}`;
  document.getElementById('multiplier-display').innerText = `М: ${multiplierRegister}`; // Отображение регистра множителя
  let dcVal=new Decimal(expression || keyboardRegister|| '0');
  dcVal=dcVal.abs();
  const displayValueString = expression.toString();
  if (displayValueString.includes(".")) {
    [integerPart, fractionalPart] = displayValueString.split(".");
  }
  if(expression>=0 && keyboardRegister.gte(0)){
    let displayValue = new Decimal(expression || keyboardRegister|| '0');
    // Проверяем длину числа
    if(displayValue.gte(maxNumber)){
      displayValueString = displayValue.toString().slice(0, 20);

      document.getElementById("status-display").innerText = "  Е"; // Указываем переполнение
      document.getElementById('expression-display').innerText = displayValue;
      flagZ = true;
    }else if(displayValue.toString().length == 21 && displayValue.toString().includes(".")){
      //document.getElementById('expression-display').innerText = displayValue;
      updateExpDisp(displayValueString);
      document.getElementById("status-display").innerText = ""; 
    }else if(displayValue.toString().length > 21 && displayValue.toString().includes(".")){
      displayValue = displayValue.toString().slice(0, 21);
      document.getElementById("status-display").innerText = " П "; // Указываем переполнение
      //document.getElementById('expression-display').innerText = displayValue;
      updateExpDisp(displayValue);
      accumulator=new Decimal(displayValue);
      document.getElementById('accumulator-display').innerText = `С: ${accumulator}`;
    }else if(displayValueString.includes(".")&&displayValueString.length>2){
      if (fractionalPart.length>20){
        displayValue = displayValue.toString().slice(0, 20);
        document.getElementById("status-display").innerText = "  Е"; // Указываем переполнение
        //document.getElementById('expression-display').innerText = displayValue;
        upupdateExpDisp(displayValue);
        flagZ = true;
      }else{
        document.getElementById('expression-display').innerText = displayValueString;
        updateExpDisp(displayValueString);
      }
    }else if (displayValue.toString().length > 20 ) {
      // Обрезаем до 20 разрядов
      displayValue = displayValue.toString().slice(0, 20);
      document.getElementById("status-display").innerText = " П "; // Указываем переполнение
      accumulator=new Decimal(displayValue);
      document.getElementById('accumulator-display').innerText = `С: ${accumulator}`;
      updateExpDisp(displayValue);
    }else{
      updateExpDisp(displayValueString);
      // const disp = document.getElementById('expression-display');
      // disp.innerHTML = '';
      // displayValueString.split('').forEach(char=>{
      //   const span = document.createElement('span');
      //   span.textContent = char;
      //   disp.appendChild(span);
      // })

      document.getElementById("status-display").innerText = "";
    }
  }else{
    let displayValue =new Decimal(expression || keyboardRegister|| '0');
    displayValue = displayValue.abs();
    if(displayValue.gte(maxNumber)){
      displayValue = displayValue.toString().slice(0, 20);
      document.getElementById("status-display").innerText = "- Е"; // Указываем переполнение
      updateExpDisp(displayValue);
      flagZ = true;
    }else if(displayValue.toString().length == 21 && displayValue.toString().includes(".")){
      displayValue = displayValue.toString();
      updateExpDisp();
      document.getElementById("status-display").innerText = "-   "; 
    }else if(displayValue.toString().length > 21 && displayValue.toString().includes(".")){
      displayValue = displayValue.toString().slice(0, 21);
      document.getElementById("status-display").innerText = "-П "; // Указываем переполнение
      accumulator=new Decimal(displayValue);
      accumulator=accumulator.negated();
      document.getElementById('accumulator-display').innerText = `С: ${accumulator}`;
      updateExpDisp(displayValue);
    }else if(displayValueString.includes(".")){
      if (fractionalPart.length>20){
        displayValue = displayValue.toString().slice(0, 20);
        document.getElementById("status-display").innerText = "- Е"; // Указываем переполнение
        updateExpDisp(displayValue);
        flagZ = true;
      }
    }else if (displayValue.toString().length > 20 ) {
      // Обрезаем до 20 разрядов
      displayValue = displayValue.toString().slice(0, 20);
      document.getElementById("status-display").innerText = "-П "; // Указываем переполнение
      accumulator=new Decimal(displayValue);
      accumulator=accumulator.negated();
      document.getElementById('accumulator-display').innerText = `С: ${accumulator}`;
      updateExpDisp(displayValue);
    }else{
      displayValue = displayValue.toString();
      updateExpDisp(displayValue);
      document.getElementById("status-display").innerText = "-  "; // Указываем переполнение
    }
  }
}

function handleCDOperation() {
  if(!flagZ){
    isFirst = true;
    conversionResult = ""; // Строка для хранения результата конвертации
    currentIndex = 0; // Индекс текущего символа для вывода
    // Проверяем состояние слайдера
    const isFractionMode = slider.checked; // Если слайдер включен, работаем с целой частью
    let dividend = accumulator.toNumber(); // Делимое (число в регистре сумматора)
    let divisor = keyboardRegister.toNumber(); // Делитель (число в регистре клавиатуры)


    if (isNaN(dividend) || isNaN(divisor) || divisor === 0) {
      alert("Введите корректные числа и убедитесь, что делитель не равен нулю.");
      return;
    }

    // Выполняем деление
    const result = new Decimal(dividend).dividedBy(divisor);

    if (!isFractionMode) {
      // Режим дробной части: оставляем только дробную часть результата
      accumulator = new Decimal(result.minus(result.floor()).toString().replace(".", "").replace("0",""));
      expression = accumulator.toString().replace(".", "").replace("0","");
    } else {
      // Режим целой части: оставляем только целую часть результата
      accumulator = result.floor();
      expression = accumulator.toString();
    }
    keyboardRegister = new Decimal(0);
    // Обновляем дисплеи
    updateDisplays();
  }
}

function updateExpDisp(displayValueString){
  const disp = document.getElementById('expression-display');
  

  disp.innerHTML = ''; // Очистить текущее содержимое

  // Массив для хранения разделённых элементов (число+точка как единый элемент)
  const elements = [];
  let buffer = ''; // Временное хранилище для числа с точкой

  for (let i = 0; i < displayValueString.length; i++) {
    const char = displayValueString[i];

    if (char === '.') {
      // Если точка, объединяем её с предыдущим числом
      buffer += char;
    } else {
      // Если символ — это число или оператор
      if (buffer) {
        // Добавляем содержимое buffer в элементы
        elements.push(buffer);
        buffer = '';
      }
      buffer += char;
    }
  }

  // Добавляем оставшийся buffer
  if (buffer) {
    elements.push(buffer);
  }

  // Вставляем элементы в DOM
  elements.forEach(element => {
    const span = document.createElement('span');
    span.textContent = element;
    disp.appendChild(span);
  });
}


function convertNumberToBase() {
  if(!flagZ){
    const base = multiplierRegister.toNumber(); // Основание системы счисления
    let n1 = new Decimal(keyboardRegister)
    let number = n1.toNumber(); // Исходное число

    if (isNaN(number) || isNaN(base) || base <= 1 || base > 10 || !keyboardRegister.toString().includes(".")) {
      alert("Введите корректное число и основание системы счисления (>1).");
      return;
    }

    // Инициализация при первом вызове
    if (conversionResult === "") {
      const isNegative = number < 0; // Проверяем, отрицательное ли число
      number = Math.abs(number); // Работаем с модулем числаь

      let wholePart = Math.floor(number); // Целая часть
      currentFraction = new Decimal(number).minus(wholePart); // Дробная часть

      let result = ""; // Для хранения всей строки результата

      // Перевод целой части
      while (wholePart > 0) {
        result = (wholePart % base) + result;
        wholePart = Math.floor(wholePart / base);
      }

      // Добавляем точку для дробной части, если она есть
      if (currentFraction.toNumber() > 0) {
        result += "."; // Точка перед дробной частью
      }

      // Генерация дробной части
      let fraction = currentFraction;
      for (let i = 0; i < 20; i++) { // Генерируем до 20 разрядов дробной части
        fraction = fraction.times(base);
        const digit = Math.floor(fraction.toNumber());
        result += digit.toString();
        fraction = fraction.minus(digit);
        if (fraction.isZero()) break; // Если дробь стала нулевой, выходим
      }

      conversionResult = result; // Сохраняем весь результат
    }

    // Печатаем следующий символ из строки результата
    if (currentIndex < conversionResult.length) {
      const nextChar = conversionResult.charAt(currentIndex);
      if (!isFirst) {
        if(conversionResult.charAt(currentIndex+1)=="."){
          expression += nextChar; // Обновляем выражение для отображения
          expression+=".";
          accumulator = new Decimal(expression);
          currentIndex++;
        }else{
          expression += nextChar; // Обновляем выражение для отображения
          accumulator = new Decimal(expression);
        }
      } else {
        expression = nextChar;
        accumulator = new Decimal(expression);
        isFirst = false;
      }
      currentIndex++; // Увеличиваем индекс для следующего символа
    } else {
      alert("Все разряды уже рассчитаны.");
      conversionResult = ""; // Строка для хранения результата конвертации
      currentIndex = 0; // Индекс текущего символа для вывода
    }

    updateDisplays();
  }
}

// Добавление числа в текущий ввод
function appendNumber(num) {
  if(!flagZ){
    isFirst = true;
    conversionResult = ""; // Строка для хранения результата конвертации
    currentIndex = 0; // Индекс текущего символа для вывода
    if ((currentInput.length + 1 <= 20) || (currentInput.length + 1 == 21 && currentInput.includes("."))) {
      if (!(parseInt(currentInput) === 0)) {
        currentInput += num.toString();
      } else {
        currentInput = num.toString();
      }
      if(!isNegative){
      keyboardRegister = new Decimal(currentInput);
      }else{
        keyboardRegister = new Decimal("-"+currentInput)
      }
      isTypingSecondNumber = true;
      expression = currentInput;
      updateDisplays();
    }
  }
}

function appendDoubleZero(){
  if(!flagZ){
    isFirst = true;
    conversionResult = ""; // Строка для хранения результата конвертации
    currentIndex = 0; // Индекс текущего символа для вывода
    if((currentInput.length+2<=20)||(currentInput.length+3==21 && currentInput.includes("."))){
      currentInput += "00";
      keyboardRegister=keyboardRegister.mul(100);
      isTypingSecondNumber = true;
      expression = currentInput;
      updateDisplays();
    }
  }
}

function appendTripleZero(){
  if(!flagZ){
    isFirst = true;
    conversionResult = ""; // Строка для хранения результата конвертации
    currentIndex = 0; // Индекс текущего символа для вывода
    if((currentInput.length+3<=20)||(currentInput.length+4==21 && currentInput.includes("."))){
      currentInput += "000";
      keyboardRegister=keyboardRegister.mul(1000);
      isTypingSecondNumber = true;
      expression = currentInput;
      updateDisplays();
    }
  }
}

function addDot() {
  if(!flagZ){
    isFirst = true;
    conversionResult = ""; // Строка для хранения результата конвертации
    currentIndex = 0; // Индекс текущего символа для вывода
    if (!currentInput.includes('.')) {
        currentInput += '.';
        keyboardRegister = new Decimal(currentInput.toString());
        expression = currentInput;
        updateDisplays();
    }
  }
}

// Сброс текущего ввода
function clearKeyboard() {
  if(!flagZ){
    isFirst = true;
    conversionResult = ""; // Строка для хранения результата конвертации
    currentIndex = 0; // Индекс текущего символа для вывода
    currentInput = '';
    keyboardRegister = new Decimal(0);
    isTypingSecondNumber = false;
    updateDisplays();
  }
}

// Сброс сумматора
function clearAccumulator() {
  if(!flagZ){
    isFirst = true;
    conversionResult = ""; // Строка для хранения результата конвертации
    currentIndex = 0; // Индекс текущего символа для вывода
    accumulator = new Decimal(0);
    signalPFlag = false;
    signalZFlag = false;
    currentInput = '';
    isTypingSecondNumber = false;
    expression = keyboardRegister.toString();
    updateDisplays();
  }
}

// Присвоение отрицательного значения текущему вводу
function negateCurrentInput() {
  if(!flagZ){
   if (isTypingSecondNumber) {
     isNegative = true;
     currentInput = keyboardRegister.toString(); // Обновляем текущее значение для отображения
     keyboardRegister = new Decimal(keyboardRegister).negated() // Меняем знак текущего значения
     updateDisplays();
   }
  }
}
function makeResOutput(){
  if(!flagZ){
    isFirst = true;
    conversionResult = ""; // Строка для хранения результата конвертации
    currentIndex = 0; // Индекс текущего символа для вывода
    currentInput = ''; // Очищаем текущее значение
    keyboardRegister = new Decimal(0); // Обновляем регистр клавиатуры результатом
    expression = accumulator.toString(); // Обновляем выражение
    operation = null; // Сбрасываем операцию
  }
}
// Выбор операции
function chooseOperation(op) {
  if(!flagZ){
    isNegative = false;
   isFirst = true;
   conversionResult = ""; // Строка для хранения результата конвертации
   currentIndex = 0; // Индекс текущего символа для вывода
   let currentNumber =new Decimal(keyboardRegister);
   if (op === '+') {
     accumulator = accumulator.plus(currentNumber);
     makeResOutput();
   } else if (op === '-') {
     accumulator = accumulator.minus(currentNumber);
     makeResOutput();
   } else if (op === '*') {
     accumulator = currentNumber.mul(multiplierRegister);
     makeResOutput();
   } else if (op === "/") {
     if (!keyboardRegister.isZero()) {
       accumulator = accumulator.dividedBy(currentNumber);
       makeResOutput();
     } else {
       expression = 'Error: Division by zero';
       accumulator = new Decimal(0);
       updateDisplays();
     }
   }
   updateDisplays();
  }
}

function clearAllRegisters() {
  flagZ=false;
  accumulator = new Decimal(0);
  keyboardRegister = new Decimal(0);
  multiplierRegister = new Decimal(0);
  currentInput = '0';
  isFirst = true;
  conversionResult = ""; // Строка для хранения результата конвертации
  currentIndex = 0; // Индекс текущего символа для вывода
  operation = null;
  expression = '';
  signalPFlag = false;
  signalZFlag = false;
  isTypingSecondNumber = false;
  updateDisplays();
  outputAccumulator()
}

// Операция извлечения квадратного корня
function sqrt() {
  if(!flagZ){
    if(keyboardRegister!=0){
      currentInput = '';
      keyboardRegister = new Decimal(keyboardRegister);
      multiplierRegister=keyboardRegister;
      expression = keyboardRegister.sqrt();
      accumulator = expression;
      keyboardRegister = new Decimal(2);
    }
    isFirst = true;
    conversionResult = ""; // Строка для хранения результата конвертации
    currentIndex = 0; // Индекс текущего символа для вывода
    updateDisplays();
  }
}

// Операции с регистрами
function transferKeyboardToMultiplier() {
  if(!flagZ){
    multiplierRegister = new Decimal(keyboardRegister);
    isFirst = true;
    conversionResult = ""; // Строка для хранения результата конвертации
    currentIndex = 0; // Индекс текущего символа для вывода
    updateDisplays();
  }
}

function transferMultiplierToKeyboard() {
  if(!flagZ){
    keyboardRegister = multiplierRegister;
    currentInput = multiplierRegister.toString();
    isFirst = true;
    conversionResult = ""; // Строка для хранения результата конвертации
    currentIndex = 0; // Индекс текущего символа для вывода
    updateDisplays();
  }
}

function transferMultiplierToAccumulator() {
  if(!flagZ){
    accumulator = multiplierRegister;
    updateDisplays();
    isFirst = true;
    conversionResult = ""; // Строка для хранения результата конвертации
    currentIndex = 0; // Индекс текущего символа для вывода
  }
}

function transferAccumulatorToKeyboard() {
  if(!flagZ){
    keyboardRegister = accumulator;
    currentInput = accumulator.toString();
    expression = accumulator;
    isFirst = true;
    conversionResult = ""; // Строка для хранения результата конвертации
    currentIndex = 0; // Индекс текущего символа для вывода
    updateDisplays();
  }
}

// Вывод содержимого регистров (треугольник С и треугольник К)
function outputAccumulator() {
  if(!flagZ){
    currentInput = accumulator.toString();
    keyboardRegister = accumulator;
    expression = currentInput;
    isFirst = true;
    conversionResult = ""; // Строка для хранения результата конвертации
    currentIndex = 0; // Индекс текущего символа для вывода
    updateDisplays();
  }
}

function outputKeyboard() {
  if(!flagZ){
    currentInput = keyboardRegister.toString();
    expression = currentInput;
    isFirst = true;
    conversionResult = ""; // Строка для хранения результата конвертации
    currentIndex = 0; // Индекс текущего символа для вывода
    updateDisplays();
  }
}


// Обработчик клавиатуры
document.addEventListener('keydown', function(event) {
  if(!flagZ){
    const key = event.key;
    isFirst = true;
    conversionResult = ""; // Строка для хранения результата конвертации
    currentIndex = 0; // Индекс текущего символа для вывода
    if (!isNaN(key)) {
      appendNumber(key);
    } else if (key === '+') {
      chooseOperation('+');
    } else if (key === '-') {
      chooseOperation('-');
    } else if (key === '*') {
      chooseOperation('*');
    } else if (key === '/') {
      chooseOperation('/');
    } else if (key === '@') { // Обработка нажатия клавиши '@'
      chooseOperation('@');
    } else if (key === 'Enter' || key === '=') {
      equals();
    } else if (key === 'Escape') {
      clearAccumulator();
    } else if (key === 'n') { // Дополнительный обработчик для негативного числа
      negateCurrentInput();
    } else if (key ===","||key==="."){
      addDot();
    }
  }
});
outputAccumulator();
// Инициализация
updateDisplays();
