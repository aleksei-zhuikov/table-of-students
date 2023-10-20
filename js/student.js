export default class Student {
  constructor(name, surename, lastname, startLearn, birthDate, faculty) {
    this.name = name;
    this.surename = surename
    this.lastname = lastname
    this.startLearn = startLearn
    this.birthDate = birthDate
    this.faculty = faculty
  }

  get fio() {
    return this.surename + ' ' + this.name + ' ' + this.lastname
  }

  getLearnPeriod() {
    const currentTime = new Date();
    const learnYears = 4
    const currentCourse = currentTime.getFullYear() - this.startLearn + 1
    const thenEndLearn = this.startLearn + learnYears
    const monthStartLearn = 9 // месяц сентябрь если он прошел то обучение закончено иначе выводится курс
    const currentMonth = currentTime.getMonth() + 1
    const currentYear = currentTime.getFullYear()

    return `
    ${this.startLearn} - ${thenEndLearn} (${currentCourse < learnYears || ((currentCourse < learnYears && currentMonth < monthStartLearn) || thenEndLearn === currentYear && currentMonth < monthStartLearn) ? `${currentCourse} курс` : 'закончил'})
    `
  }

  getBirthDateString() {
    const yyyy = this.birthDate.getFullYear();
    let mm = this.birthDate.getMonth() + 1;
    let dd = this.birthDate.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return dd + '.' + mm + '.' + yyyy;
  }

  getAge() {
    const today = new Date();
    let age = today.getFullYear() - this.birthDate.getFullYear();
    let currMonth = today.getMonth() + 1;
    // let currMonth = today.getMonth() < 12 ? today.getMonth() + 1 : 1
    let m = currMonth - this.birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < this.birthDate.getDate())) {
      age--;
    }
    return age;

  }



}




