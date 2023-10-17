import Student from './student.js'
// Массив Студентов
const students = [
  // new Student('Игорь', 'Фролов', 'Сергеевич', 2011, new Date(1992, 2, 21), 'Строительный'),
  // new Student('Алена', 'Белых', 'Юрьевна', 2021, new Date(1998, 4, 11), 'Инжинерный'),
  new Student('Иван', 'Иванов', 'Иванович', 2001, new Date(1987, 1, 23), 'Авиационный'),
]

const $studentsList = document.getElementById('students-list')
const $studentsListTHAll = document.querySelectorAll('.studentsTable th')
const formEl = document.querySelector('#addStudent')
const inputsEl = formEl.querySelectorAll('input')
const btnAddEl = formEl.querySelector('#btn-add')
const btnShowFilterEl = document.querySelector('#show-filter')

let column = 'fio',
  columnDir = true;

// Получить TR студента
function newStudentTR(student) {
  const $studentTR = document.createElement('tr'),
    $fioTD = document.createElement('td'),
    $birthDateTD = document.createElement('td'),
    $startLearnTD = document.createElement('td'),
    $facultyTD = document.createElement('td')

  $fioTD.textContent = student.fio
  $birthDateTD.textContent = student.getBirthDateString() + ' (' + student.getAge() + 'лет)'
  $startLearnTD.textContent = student.startLearn + ' (' + student.getLearnPeriod() + ' лет)'
  $facultyTD.textContent = student.faculty

  $studentTR.append($fioTD)
  $studentTR.append($birthDateTD)
  $studentTR.append($startLearnTD)
  $studentTR.append($facultyTD)

  return $studentTR;

}

// Сортировка массива Студентов по параметрам
function getSortStudents(prop, dir) {
  const studentsCopy = [...students]
  return studentsCopy.sort(function (studentA, studentB) {
    if ((!dir == false ? studentA[prop] < studentB[prop] : studentA[prop] > studentB[prop]))
      return -1;
  })
}

// Рендер
function render() {
  let studentsCopy = [...students]

  studentsCopy = getSortStudents(column, columnDir)

  $studentsList.innerHTML = ''
  for (const student of studentsCopy) {
    $studentsList.append(newStudentTR(student))
  }
}

// События сортировки
$studentsListTHAll.forEach(element => {
  element.addEventListener('click', function () {
    column = this.dataset.column;
    columnDir = !columnDir
    render();
  })
})

// Установка Attribute max для input года обучения
const $inputYear = document.getElementById('input-startLearn')
const currentYear = new Date().getFullYear().toString()
$inputYear.setAttribute('max', currentYear)

// Установка Attribute max для input дата рождения
const $inputBirthDay = document.getElementById('input-birthDay')
const today = new Date().toISOString().split('T')[0];
$inputBirthDay.setAttribute('max', today)

// Слушатель на input's для их проверки
// inputsEl.forEach(input => {
//   input.addEventListener('input', checkInputs)
// })

// Проверка что все поля заполнены и кнопка добавить станет активна
// function checkInputs() {
//   let allInputsField = true

//   inputsEl.forEach(input => {
//     if (input.value.trim() === '') {
//       allInputsField = false
//     }

//   })
//   btnAddEl.disabled = !allInputsField
// }

// Добавление студента

// добавляем класс ошибки если из input удалить текст
function addErrClass() {
  for (let input of inputsEl) {
    input.addEventListener('input', function () {
      if (input.value <= 0) {
        input.classList.add('error', 'red')
      } else {
        input.classList.remove('error', 'red')
      }
    })
  }
}
addErrClass()

// Скрывает показывает filter и меняет надпись
btnShowFilterEl.addEventListener('click', function () {
  document.getElementById('myFilter').classList.toggle('show')
  this.innerText = this.innerText == 'спрятать' ? 'показать' : 'спрятать'
})

formEl.addEventListener('submit', function (event) {
  event.preventDefault();

  students.push(new Student(

    document.getElementById('input-name').value,
    document.getElementById('input-surname').value,
    document.getElementById('input-lastname').value,
    Number(document.getElementById('input-startLearn').value),
    new Date(document.getElementById('input-birthDay').value),
    document.getElementById('input-faculty').value
  ))

  render()
  this.reset()

})
render()





