import Student from './student.js'
// Массив Студентов
let students = []

const $studentsList = document.getElementById('students-list')
const $studentsListTHAll = document.querySelectorAll('.studentsTable th')
const formEl = document.querySelector('#addStudent')
const inputsEl = formEl.querySelectorAll('input')
const btnShowFilterEl = document.querySelector('#show-filter')
const formFilterEl = document.querySelector('#filter-form')
const filterBoxBtn = document.querySelector('#filter-box_btn')

let column = 'fio',
  columnDir = true;

// Получить TR студента
function newStudentTR(student) {
  const $studentTR = document.createElement('tr'),
    $fioTD = document.createElement('td'),
    $birthDateTD = document.createElement('td'),
    $startLearnTD = document.createElement('td'),
    $facultyTD = document.createElement('td'),
    $tdDelete = document.createElement('td'),
    $btnDeleteStudent = document.createElement('button')

  // $studentTR.setAttribute('id', student.id) // id на TR
  $fioTD.textContent = student.fio
  $birthDateTD.textContent = student.getBirthDateString() + ' (' + student.getAge() + 'лет)'
  $startLearnTD.textContent = student.getLearnPeriod()
  $facultyTD.textContent = student.faculty
  $btnDeleteStudent.textContent = 'Удалить'
  $btnDeleteStudent.classList.add('btn', 'btn-danger', 'btn-sm', 'w-100')
  Object.assign($btnDeleteStudent, { type: 'button', id: 'btn-delete' })

  $tdDelete.append($btnDeleteStudent)

  // Событие удаление студента
  $btnDeleteStudent.addEventListener('click', function () {
    deleteStudent(student.id)
    $studentTR.remove()
  })

  $studentTR.append($fioTD, $birthDateTD, $startLearnTD, $facultyTD, $tdDelete)

  return $studentTR;

}

// Работа с LocalStorage
let dataFromLS = localStorage.getItem('students')

if (dataFromLS !== '' && dataFromLS !== null) {

  let studentsList = JSON.parse(dataFromLS)
  for (const item of studentsList) {
    students.push(new Student(
      item.name,
      item.surename,
      item.lastname,
      item.startLearn,
      new Date(item.birthDate),
      item.faculty,
      item.id
    ))
  }

  render()
}

// Удаление студента
function deleteStudent(id) {
  students = students.filter(student => student.id !== id)
  saveLS(students)
  render()
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

// Событие кнопок фильтра очистить, отменить
filterBoxBtn.addEventListener('click', function (event) {
  if (event.target.id === 'clearAll') {
    event.preventDefault()
    formFilterEl.reset()
  }
  if (event.target.id === 'undoAll') {
    event.preventDefault()
    formFilterEl.reset()
    render()
  }
})

// Установка Attribute max для input года обучения
const $inputYear = document.getElementById('input-startLearn')
const currentYear = new Date().getFullYear().toString()
$inputYear.setAttribute('max', currentYear)

// Установка Attribute max для input дата рождения
const $inputBirthDay = document.getElementById('input-birthDay')
const today = new Date().toISOString().split('T')[0];
$inputBirthDay.setAttribute('max', today)

// Добавляем класс ошибки если из input удалить текст
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
  document.getElementById('filter-form').classList.toggle('visible')
  this.innerText = this.innerText == 'спрятать' ? 'показать' : 'спрятать'
})

// Добавление студента
formEl.addEventListener('submit', function (event) {
  event.preventDefault();

  // Добавляем id каждому студенту
  const id = Math.floor(Date.now() * Math.random())

  students.push(new Student(

    document.getElementById('input-name').value,
    document.getElementById('input-surname').value,
    document.getElementById('input-lastname').value,
    Number(document.getElementById('input-startLearn').value),
    new Date(document.getElementById('input-birthDay').value),
    document.getElementById('input-faculty').value,
    id,
  ))
  saveLS(students)
  render()

  this.reset()

})
render()


// Сохраняем данные в LocalStorage
function saveLS(arr) {
  const saveArr = []
  for (let student of arr) {
    saveArr.push({
      name: student.name,
      surename: student.surename,
      lastname: student.lastname,
      startLearn: student.startLearn,
      birthDate: student.birthDate,
      faculty: student.faculty,
      id: student.id

    })

  }
  localStorage.setItem('students', JSON.stringify(saveArr))

}







