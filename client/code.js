let httpAdress = "http://localhost:3000"

let editMode = true

function init() {
    loadAbouts()
}

async function loadAbouts() {
    let response = await fetch(httpAdress + '/about-company')
    let abouts = await response.json()
    showAbouts(abouts)
    createAboutHeader(abouts)
    attachToggles()
    enableEditMode()
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
    let h1 = document.createElement('h1')
    let h1_class = document.createAttribute('class')
    h1_class.value = 'about-company-title'
    h1.setAttributeNode(h1_class)
    let h1_text = document.createTextNode(header.title)
    h1.appendChild(h1_text)
    aboutsHeader.appendChild(h1)

    let p = document.createElement('p')
    let p_class = document.createAttribute('class')
    p_class.value = 'about-company-txt'
    p.setAttributeNode(p_class)
    let p_text = document.createTextNode(header.text)
    p.appendChild(p_text)
    aboutsHeader.appendChild(p)
}

function createAboutListItem(about) {
    if (about.id == "0") return

    let li = document.createElement('li')
    let li_id = document.createAttribute('id')
    li_id.value = about._id
    let li_class = document.createAttribute('class')
    li_class.value = 'dropdown-element-shadowbox'
    li.setAttributeNode(li_id)
    li.setAttributeNode(li_class)

    let div = document.createElement('div')
    let div_class = document.createAttribute('class')
    div_class.value = 'dropdown-element'
    div.setAttributeNode(div_class)
    li.appendChild(div)

    let h2 = document.createElement('h2')
    let h2_class = document.createAttribute('class')
    h2_class.value = 'dropdown-title'
    h2.setAttributeNode(h2_class)
    let title = document.createTextNode(about.title)
    h2.appendChild(title)
    div.appendChild(h2)

    let p = document.createElement('p')
    let p_class = document.createAttribute('class')
    p_class.value = 'dropdown-toggle'
    p.setAttributeNode(p_class)
    let toggle = document.createTextNode("+")
    p.appendChild(toggle)
    div.appendChild(p)

    let div2 = document.createElement('div')
    let div2_class = document.createAttribute('class')
    div2_class.value = 'dropdown-content'
    div2.setAttributeNode(div2_class)
    div.appendChild(div2)

    if (about.img != "") {
        let div3 = document.createElement('div')
        let div3_class = document.createAttribute('class')
        div3_class.value = 'dropdown-img-container'
        div3.setAttributeNode(div3_class)
        div2.appendChild(div3)

        let img = document.createElement('img')
        let img_class = document.createAttribute('class')
        img_class.value = 'dropdown-img'
        let img_src = document.createAttribute('src')
        img_src.value = about.img
        img.setAttributeNode(img_class)
        img.setAttributeNode(img_src)
        div3.appendChild(img)
    }

    let p2 = document.createElement('p')
    let p2_class = document.createAttribute('class')
    p2_class.value = 'dropdown-txt'
    p2.setAttributeNode(p2_class)
    let p2_text = document.createTextNode(about.text)
    p2.appendChild(p2_text)
    div2.appendChild(p2)

    return li
}

function attachToggles() {
    $('.dropdown-toggle').on("click", function (e) {
        $(this).next('div').slideToggle(500);
        e.stopPropagation();
        e.preventDefault();
    })
}

function enableEditMode() {
    if (editMode) {
        let aboutCompany = document.getElementById("about-company-container")
        attachEditButton(aboutCompany, "id", "edit-header")
        let dropdownElements = Array.from(document.getElementsByClassName("dropdown-element"))
        for (dropdownElement of dropdownElements) {
            attachEditButton(dropdownElement, "class", "edit-about")
        }
    }
}

function attachEditButton(parentElement, attrType, attrValue) {
    if (parentElement == null) return
    let editButton = document.createElement('button')
    let editButton_attr = document.createAttribute(attrType)
    editButton_attr.value = attrValue
    editButton.setAttributeNode(editButton_attr)
    let editButton_text = document.createTextNode('Edit')
    editButton.appendChild(editButton_text)
    editButton.onclick = function () { editAbout(editButton) }
    parentElement.insertBefore(editButton, parentElement.children[0])
}

function editAbout(editButton) {
    editButton.innerText = "Cancel"
    editButton.onclick = function () { saveAbout(editButton) }
    attachEditForm(editButton.parentNode)
}

function saveAbout(editButton) {
    editButton.innerText = "Edit"
    editButton.onclick = function () { editAbout(editButton) }
    detatchEditForm()
}

function attachEditForm(parentElement) {
    // form
    let form = document.createElement('form')
    let form_id = document.createAttribute('id')
    form_id.value = "edit-form"
    form.setAttributeNode(form_id)
    // title label
    let label1 = document.createElement('label')
    let label1_class = document.createAttribute('class')
    label1_class.value = "edit-form-label"
    label1.setAttributeNode(label1_class)
    label1.setAttribute("for", "form-title");
    let label1_text = document.createTextNode('Title')
    label1.appendChild(label1_text)
    form.appendChild(label1)
    // title input
    let input1 = document.createElement('input')
    let input1_id = document.createAttribute('id')
    input1_id.value = "form-title"
    input1.setAttributeNode(input1_id)
    let input1_class = document.createAttribute('class')
    input1_class.value = "edit-form-input"
    input1.setAttributeNode(input1_class)
    input1.setAttribute("type", "text");
    form.appendChild(input1)
    form.appendChild(document.createElement('br'))
    form.appendChild(document.createElement('br'))
    // image label
    let label2 = document.createElement('label')
    let label2_class = document.createAttribute('class')
    label2_class.value = "edit-form-label"
    label2.setAttributeNode(label2_class)
    label2.setAttribute("for", "form-image");
    let label2_text = document.createTextNode('Image path')
    label2.appendChild(label2_text)
    form.appendChild(label2)
    // image input
    let input2 = document.createElement('input')
    let input2_id = document.createAttribute('id')
    input2_id.value = "form-image"
    input2.setAttributeNode(input2_id)
    let input2_class = document.createAttribute('class')
    input2_class.value = "edit-form-input"
    input2.setAttributeNode(input2_class)
    input2.setAttribute("type", "text");
    form.appendChild(input2)
    form.appendChild(document.createElement('br'))
    form.appendChild(document.createElement('br'))
    // text label
    let label3 = document.createElement('label')
    let label3_class = document.createAttribute('class')
    label3_class.value = "edit-form-label"
    label3.setAttributeNode(label3_class)
    label3.setAttribute("for", "form-txt");
    let label3_text = document.createTextNode('Text')
    label3.appendChild(label3_text)
    form.appendChild(label3)
    // text input
    let input3 = document.createElement('input')
    let input3_id = document.createAttribute('id')
    input3_id.value = "form-txt"
    input3.setAttributeNode(input3_id)
    let input3_class = document.createAttribute('class')
    input3_class.value = "edit-form-input"
    input3.setAttributeNode(input3_class)
    input3.setAttribute("type", "text");
    form.appendChild(input3)
    parentElement.appendChild(form)
}

function detatchEditForm() {
    let form = document.getElementById("edit-form")
    form.parentNode.removeChild(form)
}