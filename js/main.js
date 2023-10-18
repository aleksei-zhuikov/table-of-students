import Student from './student.js'
// Массив Студентов
const students = [
  new Student('Игорь', 'Фролов', 'Сергеевич', 2011, new Date(1992, 2, 21), 'Строительный'),
  new Student('Алена', 'Белых', 'Александровна', 2021, new Date(1998, 4, 11), 'Инжинерный'),
  new Student('Иван', 'Иванов', 'Иванович', 2001, new Date(1987, 1, 23), 'Авиационный'),
  new Student('Александр', 'Мухин', 'Сергеевич', 2011, new Date(1992, 2, 21), 'Химический'),
  new Student('Марфа', 'Иванова', 'Алексеевна', 2011, new Date(1992, 2, 21), 'Химический'),
]

const $studentsList = document.getElementById('students-list')
const $studentsListTHAll = document.querySelectorAll('.studentsTable th')
const formEl = document.querySelector('#addStudent')
const inputsEl = formEl.querySelectorAll('input')
const btnAddEl = formEl.querySelector('#btn-add')
const btnShowFilterEl = document.querySelector('#show-filter')
const formFilterEl = document.querySelector('#filter-form')


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

// Фильтр студентов по параметрам
function filterStudents(arr, prop, value) {
  const sortedArr = []
  const copyArr = [...arr]
  for (const item of copyArr) {
    if (String(item[prop]).match(new RegExp(value, 'i'))) sortedArr.push(item)
  }
  return sortedArr
}

// Рендер
function render() {
  let studentsCopy = [...students]

  studentsCopy = getSortStudents(column, columnDir)

  $studentsList.innerHTML = ''

  // получаем значения из input фильтрация
  const fioVal = document.querySelector('#filter-fioVal').value,
    birthDateVal = document.querySelector('#filter-birthDateVal').value,
    yearLearnVal = document.querySelector('#filter-yearLearnVal').value,
    facultyVal = document.querySelector('#filter-facultyVal').value

  if (fioVal !== '') studentsCopy = filterStudents(studentsCopy, 'fio', fioVal)
  if (birthDateVal !== '') studentsCopy = filterStudents(studentsCopy, 'birthDate', birthDateVal)
  if (yearLearnVal !== '') studentsCopy = filterStudents(studentsCopy, 'startLearn', yearLearnVal)
  if (facultyVal !== '') studentsCopy = filterStudents(studentsCopy, 'faculty', facultyVal)

  for (const student of studentsCopy) {
    $studentsList.append(newStudentTR(student))
  }
}

// Событие на Фильтр студентов
formFilterEl.addEventListener('submit', function (event) {
  event.preventDefault()
  render(students)
})

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

// Скрывает показывает filter и меняет надпись кнопки
btnShowFilterEl.addEventListener('click', function () {
  document.getElementById('filter-form').classList.toggle('show')
  this.innerText = this.innerText == 'спрятать' ? 'показать' : 'спрятать'
})

// Добавление студента
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





