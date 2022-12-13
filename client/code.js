// render all nodes and buttons
async function init() {
    let abouts = await loadAbouts()
    showAbouts(abouts)
    createAboutHeader(abouts)
    attachToggles()
    attachEditModeButton()
}

//#region Initialization

// fetch Abouts from DB
async function loadAbouts() {
    let response = await fetch(httpAdress + '/about-company')
    return await response.json()
}

// create the "About Company" header
function createAboutHeader(abouts) {
    let aboutsHeader = document.getElementById('about-company-header')
    // this About always has id = 0
    let header = abouts.filter(function (about) { return about.id == 0 })[0]
    // abort if there is no Abouts with id = 0
    if (header == null) return
    let h1 = createElementWithTxt('h1', 'class', 'about-company-title', header.title)
    aboutsHeader.appendChild(h1)
    let p = createElementWithTxt('p', 'class', 'about-company-txt', header.text)
    aboutsHeader.appendChild(p)
}

// create a list of all Abouts
function showAbouts(abouts) {
    let aboutsList = document.getElementById('about-company-list')
    abouts.forEach(about => {
        let li = createAboutListItem(about)
        if (li != null) aboutsList.appendChild(li)
    })
}

// attach toggle events to each "+"-toggles in the list
function attachToggles() {
    $('.dropdown-toggle').on("click", function (e) {
        $(this).next('div').slideToggle(500);
        e.stopPropagation();
        e.preventDefault();
    })
}

// attach Edit Mode button
function attachEditModeButton() {
    let sliderContainer = document.getElementById("slider-container")
    attachButton(sliderContainer, 'id', 'edit-mode', 'Edit Mode', toggleEditMode, 0)
}
//#endregion

//#region Generic Functions

// generic function for all button attachments
function attachButton(parentElement, attrType, attrValue, text, callback, position) {
    if (parentElement == null) return
    let button = createElementWithTxt('button', attrType, attrValue, text)
    button.onclick = function () { callback(button) }
    parentElement.insertBefore(button, parentElement.children[position])
}

// generic function for all new elements
function createElement(elementType, attrType, attrValue) {
    let element = document.createElement(elementType)
    element.setAttribute(attrType, attrValue)
    return element
}

// generic function 2 for all new elements
function createElement2(elementType, attrType, attrValue, attrType2, attrValue2) {
    let element = document.createElement(elementType)
    element.setAttribute(attrType, attrValue)
    element.setAttribute(attrType2, attrValue2)
    return element
}

// generic function 3 for all new elements
function createElementWithTxt(elementType, attrType, attrValue, text) {
    let element = document.createElement(elementType)
    element.setAttribute(attrType, attrValue)
    element.appendChild(document.createTextNode(text))
    return element
}

// generic function for new li elements
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
        // create an img element
        // null means that there is no existing img element
        attachImage(null, div2, about)
    }
    let p2 = createElementWithTxt('p', 'class', 'dropdown-txt', about.text)
    div2.appendChild(p2)
    return li
}

// generic function for image element creation and attachment
function attachImage(image, parentElement, about) {
    if (image != null) {
        image.setAttribute('src', about.img)
        return
    }
    else {
        let div = createElement('div', 'class', 'dropdown-img-container')
        parentElement.appendChild(div)
        let img = createElement2('img', 'class', 'dropdown-img', 'src', about.img)
        div.insertBefore(img, div.children[0])
    }
}

// generic function for element removal
function removeById(idAttr) {
    let element = document.getElementById(idAttr)
    element.parentNode.removeChild(element)
}

// generic function 2 for element removal
function removeAllbyClass(classAttr) {
    let elements = document.querySelectorAll(classAttr)
    for (const elment of elements) {
        elment.parentNode.removeChild(elment)
    }
}

// generic function 3 for element removal
function removeFromParentByClass(_element, classAttr) {
    let element = _element.parentNode.querySelector(classAttr)
    element.parentNode.removeChild(element)
}
//#endregion

//#region Edit Mode Toggle

// disable Edit Mode on load
let editMode = false

// toggle
function toggleEditMode(button) {
    editMode = !editMode
    if (editMode) {
        enableEditMode()
    }
    else {
        disableEditMode()
    }
}

// add all editing buttons
function enableEditMode() {
    // attach Edit button to the header
    let aboutCompanyHeader = document.getElementById("about-company-header")
    attachButton(aboutCompanyHeader, 'id', 'edit-header', 'Edit', editAbout, 0)
    // attach Edit button to all Abouts
    let dropdownElements = document.querySelectorAll(".dropdown-element-shadowbox")
    for (dropdownElement of dropdownElements) {
        attachButton(dropdownElement, "class", "edit-about", 'Edit', editAbout, 0)
        attachButton(dropdownElement, 'class', 'delete-about', 'Delete', deleteAbout, 0)
    }
    // create Add button under the Abouts list
    let aboutCompanyList = document.getElementById("about-company-list")
    attachButton(aboutCompanyList, 'id', 'add-about', 'Add New', attachNewAboutForm, aboutCompanyList.childElementCount)
}

// remove all editing buttons
function disableEditMode() {
    removeById('edit-header')
    removeAllbyClass('.edit-about')
    removeAllbyClass('.delete-about')
    removeAllbyClass('.cancel-about')
    removeAllbyClass('.update-about')
    removeAllbyClass('.edit-form')
    removeById('add-about')
    removeAllbyClass('.save-about')
}
//#endregion

//#region Button Events

// Edit button event
function editAbout(button) {
    // change button text value and event function
    button.innerText = 'Cancel'
    button.onclick = function () { cancelEditAbout(button) }
    // create and attach a new form for editing
    let parentElement = button.parentNode
    attachEditForm(parentElement)
    // add Update button under the created form
    attachButton(parentElement, 'class', 'update-about', 'Update', updateAbout, parentElement.childElementCount)
    // remove Add button to avoid overlap of values from multiple forms
    removeById('add-about')
}

// Cancel button event (cancel editing)
function cancelEditAbout(button) {
    // change back text value and event function
    button.innerText = "Edit"
    button.onclick = function () { editAbout(button) }
    // remove the form
    removeFromParentByClass(button, '.edit-form')
    // remove Update button
    removeFromParentByClass(button, '.update-about')
    // return Add button under the list
    createAddButton()
}

// Add button event
function attachNewAboutForm(button) {
    let parentElement = button.parentNode
    // new edit form
    attachEditForm(parentElement)
    // new Save and Cancel buttons
    attachButton(parentElement, 'class', 'save-about', 'Save', addAbout, parentElement)
    attachButton(parentElement, 'class', 'cancel-about', 'Cancel', detachNewaboutForm, parentElement)
}
// Cancel button event (cancel adding)
function detachNewaboutForm(button) {
    // remove all elements created by Add button
    removeFromParentByClass(button, '.edit-form')
    removeFromParentByClass(button, '.save-about')
    removeFromParentByClass(button, '.cancel-about')
}
//#endregion

//#region Form Functions

// generic function to create an Edit form
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
    // submit (not used)
    // createInput(form, 'input', 'class', 'edit-form-submit', 'name', 'form_submit', 'type', 'submit', 'value', 'Save')
    parentElement.appendChild(form)
}

// generic function for lables
function createLabel(form, attrType, attrValue, inputID, text) {
    let label = document.createElement('label')
    label.setAttribute(attrType, attrValue)
    label.setAttribute("for", inputID);
    label.appendChild(document.createTextNode(text))
    form.appendChild(label)
}

// generic function for input fields
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

// convert form values to a json object
function convertFormToJson(form, id) {
    if (form == null) return
    let title = form[0].value
    let image = form[1].value
    let text = form[2].value
    const data = {}
    if (title != "") data.id = id
    if (title != "") data.title = title
    if (text != "") data.text = text
    if (image != "") data.img = image
    if (image == "remove") data.img = ""
    return data
}
//#endregion

//#region HTTP Requests

// server address
let httpAdress = "https://fsp-ab0189.deta.dev"

async function addAbout(button) {
    // check if title and text field are not empty
    let form = button.parentNode.querySelector('.edit-form')
    if (form[0].value == "" || form[2].value == "") return
    // generate new id value (custom id)
    let abouts = await loadAbouts()
    if (abouts == null) return
    let id = abouts.length
    // create a json object
    const data = convertFormToJson(form, id)
    // send a new About object to the server
    const response = await fetch(httpAdress + '/about-company', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    // create and attach a new li elment
    let about = await response.json()
    createNewLiAndAppend(button, about)
}

function createNewLiAndAppend(button, about) {
    let aboutsList = document.getElementById('about-company-list')
    let li = createAboutListItem(about)
    let addButton = document.getElementById('add-about')
    if (li != null) aboutsList.insertBefore(li, addButton)
    // remove form and buttons
    removeFromParentByClass(button, '.edit-form')
    removeFromParentByClass(button, '.cancel-about')
    removeFromParentByClass(button, '.save-about')
    // attach Edit button to the li element
    let parentElement = document.getElementById(about._id)
    attachButton(parentElement, 'id', 'edit-header', 'Edit', editAbout, 0)
}

async function updateAbout(button) {
    // _id equals to the id of the parent element
    let _id = button.parentNode.id
    let form = button.parentNode.querySelector('.edit-form')
    // create a json object id
    // id is not needed for updates
    const data = convertFormToJson(form, "")
    const response = await fetch(httpAdress + '/about-company/' + _id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    let about = await response.json()
    // update the li element values
    updateDropdown(about)
    // trigger Cancel button event to remove editor tools
    cancelEditAbout(button)
}

function updateDropdown(about) {
    // get elements
    let parentElement = document.getElementById(about._id)
    let dropdownContent = parentElement.querySelector('.dropdown-content')
    let title = parentElement.querySelector('.dropdown-title')
    let image = parentElement.querySelector('.dropdown-img')
    let text = parentElement.querySelector('.dropdown-txt')
    // update values
    title.textContent = about.title
    // image is removed if img value is empty
    if (about.img == "") removeFromParentByClass(image, '.dropdown-img')
    // otherwise an img element is updated or created
    else attachImage(image, dropdownContent, about)
    text.textContent = about.text
}

async function deleteAbout(button) {
    // _id equals to the id of the parent element
    let id = button.parentNode.id
    const response = await fetch(httpAdress + '/about-company/' + id, {
        method: 'DELETE'
    })
    let deletedAbout = await response.json()
    // find and delet the li element
    let li = document.getElementById(deletedAbout._id)
    li.remove()
    // trigger Cancel button event to remove editor tools
    cancelEditAbout(button)
}
//#endregion