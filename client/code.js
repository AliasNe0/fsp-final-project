let httpAdress = "http://localhost:3000"

let editMode = false

async function init() {
    let abouts = await loadAbouts()
    showAbouts(abouts)
    createAboutHeader(abouts)
    attachToggles()
    attachEditModeButton()
}

async function loadAbouts() {
    let response = await fetch(httpAdress + '/about-company')
    return await response.json()
}

function showAbouts(abouts) {
    let aboutsList = document.getElementById('about-company-list')
    abouts.forEach(about => {
        let li = createAboutListItem(about)
        if (li != null) aboutsList.appendChild(li)
    })
}

function createAboutHeader(abouts) {
    let aboutsHeader = document.getElementById('about-company-header')
    let header = abouts.filter(function (about) { return about.id == 0 })[0]
    if (header == null) return
    let h1 = createElementWithTxt('h1', 'class', 'about-company-title', header.title)
    aboutsHeader.appendChild(h1)
    let p = createElementWithTxt('p', 'class', 'about-company-txt', header.text)
    aboutsHeader.appendChild(p)
}

function attachToggles() {
    $('.dropdown-toggle').on("click", function (e) {
        $(this).next('div').slideToggle(500);
        e.stopPropagation();
        e.preventDefault();
    })
}

function attachEditModeButton() {
    let sliderContainer = document.getElementById("slider-container")
    attachButton(sliderContainer, 'id', 'edit-mode', 'Edit Mode', toggleEditMode, 0)
}

function attachButton(parentElement, attrType, attrValue, text, callback, position) {
    if (parentElement == null) return
    let button = createElementWithTxt('button', attrType, attrValue, text)
    button.onclick = function () { callback(button) }
    parentElement.insertBefore(button, parentElement.children[position])
}

function createElement(elementType, attrType, attrValue) {
    let element = document.createElement(elementType)
    element.setAttribute(attrType, attrValue)
    return element
}

function createElement2(elementType, attrType, attrValue, attrType2, attrValue2) {
    let element = document.createElement(elementType)
    element.setAttribute(attrType, attrValue)
    element.setAttribute(attrType2, attrValue2)
    return element
}

function createElementWithTxt(elementType, attrType, attrValue, text) {
    let element = document.createElement(elementType)
    element.setAttribute(attrType, attrValue)
    element.appendChild(document.createTextNode(text))
    return element
}

function createAboutListItem(about) {
    if (about.id == "0") return
    let li = createElement2('li', 'id', about._id, 'class', 'dropdown-element-shadowbox')
    let div = createElement('div', 'class', 'dropdown-element')
    li.appendChild(div)
    let h2 = createElementWithTxt('h2', 'class', 'dropdown-title', about.title)
    div.appendChild(h2)
    let p = createElementWithTxt('p', 'class', 'dropdown-toggle', '+')
    div.appendChild(p)
    let div2 = createElement('div', 'class', 'dropdown-content')
    div.appendChild(div2)
    if (about.img != "") {
        let div3 = createElement('div', 'class', 'dropdown-img-container')
        div2.appendChild(div3)
        let img = createElement2('img', 'class', 'dropdown-img', 'src', about.img)
        div3.appendChild(img)
    }
    let p2 = createElementWithTxt('p', 'class', 'dropdown-txt', about.text)
    div2.appendChild(p2)
    return li
}

function toggleEditMode(button) {
    editMode = !editMode
    if (editMode) {
        enableEditMode()
    }
    else {
        disableEditMode()
    }
}

function enableEditMode() {
    let aboutCompanyHeader = document.getElementById("about-company-header")
    attachButton(aboutCompanyHeader, 'id', 'edit-header', 'Edit', editAbout, 0)
    let dropdownElements = document.querySelectorAll(".dropdown-element-shadowbox")
    for (dropdownElement of dropdownElements) {
        attachButton(dropdownElement, "class", "edit-about", 'Edit', editAbout, 0)
    }
    let aboutCompanyList = document.getElementById("about-company-list")
    attachButton(aboutCompanyList, 'id', 'add-about', 'Add', attachNewAboutForm, aboutCompanyList.childElementCount)
}

function disableEditMode() {
    removeById('edit-header')
    removeAllbyClass('.edit-about')
    removeAllbyClass('.cancel-about')
    removeAllbyClass('.update-about')
    removeAllbyClass('.edit-form')
    removebyId('add-about')
    removeAllbyClass('.save-about')
}

function removeById(idAttr) {
    let element = document.getElementById(idAttr)
    element.parentNode.removeChild(element)
}

function removeAllbyClass(classAttr) {
    let elements = document.querySelectorAll(classAttr)
    for (const elment of elements) {
        elment.parentNode.removeChild(elment)
    }
}

function removeFromParentByClass(_element, classAttr) {
    let element = _element.parentNode.querySelector(classAttr)
    element.parentNode.removeChild(element)
}

function editAbout(button) {
    button.innerText = 'Cancel'
    button.onclick = function () { cancelEditAbout(button) }
    let parentElement = button.parentNode
    attachEditForm(parentElement)
    attachButton(parentElement, 'class', 'update-about', 'Update', updateAbout, parentElement.childElementCount)
    attachButton(parentElement, 'class', 'delete-about', 'Delete', deleteAbout, 0)
}

function cancelEditAbout(button) {
    button.innerText = "Edit"
    button.onclick = function () { editAbout(button) }
    removeFromParentByClass(button, '.edit-form')
    removeFromParentByClass(button, '.delete-about')
    removeFromParentByClass(button, '.update-about')
}

function attachEditForm(parentElement) {
    // form
    let form = document.createElement('form')
    form.setAttribute('class', 'edit-form');
    // title
    createLabel(form, 'class', 'edit-form-label', 'form-title', 'Title')
    createInput(form, 'input', 'id', 'form-title', 'class', 'edit-form-input', 'name', 'form_title', 'type', 'text')
    // image
    createLabel(form, 'class', 'edit-form-label', 'form-image', 'Image')
    createInput(form, 'input', 'id', 'form-image', 'class', 'edit-form-input', 'name', 'form_image', 'type', 'text')
    // text
    createLabel(form, 'class', 'edit-form-label', 'form-txt', 'Text')
    createInput(form, 'textarea', 'id', 'form-txt', 'class', 'edit-form-input', 'name', 'form_txt', 'rows', '20')
    // submit
    // createInput(form, 'input', 'class', 'edit-form-submit', 'name', 'form_submit', 'type', 'submit', 'value', 'Save')
    parentElement.appendChild(form)
}

function createLabel(form, attrType, attrValue, inputID, text) {
    let label = document.createElement('label')
    label.setAttribute(attrType, attrValue)
    label.setAttribute("for", inputID);
    label.appendChild(document.createTextNode(text))
    form.appendChild(label)
}

function createInput(form, inputType, attrType, attrValue, attrType2, attrValue2, attrType3, attrValue3, attrType4, attrValue4) {
    let input = document.createElement(inputType)
    input.setAttribute(attrType, attrValue)
    input.setAttribute(attrType2, attrValue2)
    input.setAttribute(attrType3, attrValue3)
    input.setAttribute(attrType4, attrValue4)
    form.appendChild(input)
    form.appendChild(document.createElement('br'))
    form.appendChild(document.createElement('br'))
}

function attachNewAboutForm(button) {
    let parentElement = button.parentNode
    attachEditForm(parentElement)
    attachButton(parentElement, 'class', 'save-about', 'Save', addAbout, parentElement)
    attachButton(parentElement, 'class', 'cancel-about', 'Cancel', detachNewaboutForm, parentElement)
}

function detachNewaboutForm(button) {
    removeFromParentByClass(button, '.cancel-about')
    removeFromParentByClass(button, '.edit-form')
    removeFromParentByClass(button, '.save-about')
}

async function convertFormToJson(button) {
    let form = button.parentNode.querySelector('.edit-form')
    if (form == null) return
    let title = form[0].value
    let image = form[1].value
    let text = form[2].value
    if (title == "" || text == "") return
    let abouts = await loadAbouts()
    if (abouts == null) return
    const data = {
        'id': abouts.length,
        'title': title,
        'text': text,
        'img': image
    }
    return data
}

async function addAbout(button) {
    const data = await convertFormToJson(button)
    const response = await fetch(httpAdress + '/about-company', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    let about = await response.json()
    let aboutsList = document.getElementById('about-company-list')
    let li = createAboutListItem(about)
    let addButton = document.getElementById('add-about')
    if (li != null) aboutsList.insertBefore(li, addButton)
    detachNewaboutForm(button)
}

async function updateAbout(button) {
    let id = button.parentNode.id
    const data = await convertFormToJson(button)
    const response = await fetch(httpAdress + '/about-company/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    let about = await response.json()
    updateDropdown(about)
}

function updateDropdown(about) {
    let parentElement = document.getElementById(about._id)
    let title = parentElement.querySelector('.dropdown-title')
    let image = parentElement.querySelector('.dropdown-img')
    let text = parentElement.querySelector('.dropdown-txt')
    title.textContent = about.title
    image.setAttribute('src', about.img)
    text.textContent = about.text
}

async function deleteAbout(button) {
    let id = button.parentNode.id
    const response = await fetch(httpAdress + '/about-company/' + id, {
        method: 'DELETE'
    })
    let deletedAbout = await response.json()
    let li = document.getElementById(deletedAbout._id)
    li.remove()
    cancelEditAbout(button)
}