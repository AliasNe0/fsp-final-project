let httpAdress = "http://localhost:3000"

function init() {
    loadAbouts()
}

async function loadAbouts() {
    let response = await fetch(httpAdress + '/about-company')
    let abouts = await response.json()
    showAbouts(abouts)
    createAboutHeader(abouts)
    attachToggles()
}

function attachToggles() {
    $('.dropdown-toggle').on("click", function (e) {
        $(this).next('div').slideToggle(500);
        e.stopPropagation();
        e.preventDefault();
    })
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
    let header = abouts.filter(function(about){return about.id == 0})[0]

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