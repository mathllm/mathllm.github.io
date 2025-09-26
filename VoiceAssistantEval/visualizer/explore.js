
// Data file

BASE_DIR = "./data";

DATA_FILE = "data_public.js"; // default, answers for testmini, no answer for test


// Variables for the filters with the number of questions
let number_options = [10, 20, 50, 100];
let category1_options = ["All", "Listening", "Speaking", "Viewing"];
let category2_options = ["All", "General", "Music", "Sound", "Speech", "Assistant", "Emotion", "Instruction_Following", "Multi_Round", "Reasoning", "Robustness", "Roleplay", "Safety", "Multi_Discipline"];

// Elements in the Option Panel
let optbtn = document.getElementsByClassName("optionsbtn")[0];
let closebtn = document.getElementsByClassName("closebtn")[0];
let optionpanel = document.getElementById("option-panel");
let optboxes = document.getElementsByClassName("optbox");
let opt_dds = document.getElementsByClassName("opt-dd");
let filter_submit = document.getElementById("filter-submit");

// Element Text the Option Panel
let number_dd = make_dropdown("How many samples?", number_options, "number_dd");
let category1_dd = make_dropdown("Choose category1:", category1_options, "category1_dd");
let category2_dd = make_dropdown("Choose category2:", category2_options, "category2_dd");

// Content in the Option Box
optboxes[0].innerHTML += number_dd;
optboxes[0].innerHTML += category1_dd;
optboxes[0].innerHTML += category2_dd;

// Elements in the Content Body
let body = document.getElementById("content-body");
let display = document.getElementById("display");

// Click actions for the option buttons
optbtn.addEventListener("click", openNav);
closebtn.addEventListener("click", closeNav);

// Responsive: if screen is narrow, body only displays one column
if (window.innerWidth < 600) {
    body.style.flexDirection = "column";
}

// Set up the data filters and display the page
let filters = {};

for (each of opt_dds) {
    each.addEventListener("change", change_filters);
}

// Display the page when clicking the fresh button
filter_submit.addEventListener("click", filter_data);
if (window.innerWidth < 600) {
    filter_submit.addEventListener("click", closeNav);
}

// Display the page when it is running at the first time
filter_data();

// Functions
var display_padding = display.style.padding;
function openNav() {
    if (window.innerWidth < 600) {
        // optionpanel.style.zIndex = "2";
        optionpanel.style.width = "100vw";
        display.style.width = "0vw";
        display.style.padding = "0";
    } else {
        optionpanel.style.width = "30vw";
        display.style.width = "50vw";
    }
    for (each of optionpanel.children) 
        each.style.display = "block";
}

function closeNav() {
    // display.style.display = "block";
    optionpanel.style.width = "0vw";
    display.style.width = "100vw";
    display
    for (each of optionpanel.children) {
        each.style.display = "none";
    }
}

// Function: update the filter values
function change_filters(e) {
    filters.number = document.getElementById("number_dd").value;
    filters.category1 = document.getElementById("category1_dd").value;
    filters.category2 = document.getElementById("category2_dd").value;
}

// Function: draw the page
function create_page(d) {
    if (d.length === 0) {
        body.innerHTML = "<p>No number satisfies All the filters.</p>";
    } else {
        col1 = create_col(d.slice(0, d.length / 2));
        col2 = create_col(d.slice(d.length / 2));
        body.innerHTML = col1 + col2;
    }
    reflow(body);
    console.log("reflowed");
}

function create_col(data) {
    res = [];

    for (each of data) {
        res.push(create_number(each));
    }

    return `<div class="display-col"> ${res.join("")} </div>`;
}

// Helper function to escape HTML and preserve formatting
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
}

// data is an object with the following attr.
function create_number(data) {
    let elements = [];

    // ID
    elements.push(`<p><b>ID:</b> ${data.id}</p>`);

    // System prompt
    if (data.system_prompt) {
        elements.push(`<p><b>System Prompt:</b></p><div class="system-prompt-txt" style="white-space: pre-wrap; word-break: break-word;">${escapeHtml(data.system_prompt)}</div>`);
    }

    // Role name
    if (data.extra.role_name) {
        elements.push(`<p><b>Role Name:</b> ${escapeHtml(data.extra.role_name)}</p>`);
    }

    // Role audio
    if (data.role_audio) {
        elements.push(`<p><b>Role Audio:</b></p>`);
        elements.push(make_audio(data.role_audio));
    }

    // Sound audio
    if (data.sound_audio) {
        elements.push(`<p><b>Sound Audio:</b></p>`);
        elements.push(make_audio(data.sound_audio));
    }

    // User audios interleaved with transcripts
    for (let i = 0; i < 7; i++) {
        const audioKey = `user_audio_${i}`;
        if (data[audioKey]) {
            elements.push(`<p><b>User Audio ${i}:</b></p>`);
            elements.push(make_audio(data[audioKey]));

            // Add transcript if available
            if (data.extra.user_audio_transcripts && data.extra.user_audio_transcripts[i]) {
                elements.push(`<p><b>Transcript ${i}:</b></p><div class="transcript-txt" style="white-space: pre-wrap; word-break: break-word;">${escapeHtml(data.extra.user_audio_transcripts[i])}</div>`);
            }
        }
    }

    // Images
    for (let i = 0; i < 5; i++) {
        const imageKey = `image_${i}`;
        if (data[imageKey]) {
            elements.push(`<p><b>Image ${i}:</b></p>`);
            elements.push(make_img(data[imageKey]));
        }
    }

    // Reference answers
    if (data.ref_answers && data.ref_answers.length > 0) {
        elements.push(`<p><b>Reference Answers:</b></p>`);
        for (let i = 0; i < data.ref_answers.length; i++) {
            elements.push(`<div class="answer-txt" style="white-space: pre-wrap; word-break: break-word;">[${i}] ${escapeHtml(data.ref_answers[i])}</div>`);
        }
    }

    html = make_box(elements) + "<hr/>";

    return html;
}

// creates a div with question text in it
function make_qt(pid, question) {
    let html = `
            <p><b>Question </b></p>
            <p class="question-txt">[${pid}] ${question}</p>
    `;
    return html;
}

function make_hint(hint) {
    if (hint === null) return "";
    let html = `<p><b>Context </b></p><p class="hint-txt">${hint}</p>`;
    return html;
}

function make_transcript(transcript) {
    if (!transcript) return "";
    let html = `<p><b>Audio Transcript </b></p><p class="transcript-txt">${transcript}</p>`;
    return html;
}

function make_img(path) {
    if (path === null) return "";
    let html = `<img src="${path}" alt="number image" class="question-img" />`;
    return html;
}

function make_audio(path) {
    if (path === null) return "";
    let html = `<audio controls>
                    <source src="${path}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>`;
    return html;
}

function make_box(contents, cls = "") {
    if (contents.join("").length === 0) return "";
    let html = `
        <div class="box ${cls}"> 
            ${contents.join(" ")}
        </div>
    `;
    return html;
}

function make_choices(choices) {
    // console.log(choices);
    let temp = "";
    let len = 0;
    for (each of choices) {
        let html = make_choice(each);
        temp += html;
        len += each.length;
    }
    let html = "";
    if (len < 60)
        html = `<p><b>Choices </b></p><div class="choices">${temp}</div>`;
    else
        html = `<p><b>Choices </b></p><div class="choices-vertical">${temp}</div>`;
    return html;
}
function make_choice(choice) {
    let html = `<p class="choice-txt">${choice}</p>`;
    return html;
}

function make_answer(answer) {
    let html = `<p><b>Answer </b></p><p class="answer-txt">${answer}</p>`;
    return html;
}

function make_dropdown(label, options, id, default_ind = 0) {
    let html = "";
    for (let i = 0; i < options.length; i++) {
        if (i === default_ind)
            html += `<option value="${options[i]}" selected> ${options[i]} </option>`;
        else
            html += `<option value="${options[i]}"> ${options[i]} </option>`;
    }
    html = `<label class="dd-label">${label} <select id="${id}" class="opt-dd"> ${html} </select> </label><br/>`;
    return html;
}


// Main Functions (FIXME: need to be updated)
async function filter_data() {
    // set up or update the filter
    change_filters();

    console.log(filters);
    // e.g. data/{"dataset": "CLEVR-Math", "number": 20}

    // success event 
    let scriptEle = document.createElement("script");
    // scriptEle.setAttribute("src", `data/${filters.dataset}_test.js`);
    scriptEle.setAttribute("src", `data/${DATA_FILE}`);
    scriptEle.setAttribute("type", "text/javascript");
    scriptEle.setAttribute("async", false);
    document.body.appendChild(scriptEle);

    scriptEle.addEventListener("load", () => {
        console.log("File loaded");
        res = test_data;
        // console.log(res);


        // go over res and add id as pid to each element
        for (let i of Object.keys(res)) {
            res[i].pid = res[i].id || i;
        }

        // filter: category1
        if (filters.category1 !== "All") {
            for (let i of Object.keys(res)) {
                if (res[i].category1 !== filters.category1) {
                    delete res[i];
                }
            }
        }

        // filter: category2
        if (filters.category2 !== "All") {
            for (let i of Object.keys(res)) {
                if (res[i].category2 !== filters.category2) {
                    delete res[i];
                }
            }
        }
    


        // filter: number
        cnt = filters.number;
        if (cnt != "All") {
            cnt = Number.parseInt(cnt);
            d = _.sample(res, Math.min(cnt, Object.keys(res).length));

        } else {
            d = [];
            for (let i of Object.keys(res)) {
                d.push(res[i]);
            }
        }

   
        create_page(d);
    });
}

// force the browser to reflow
function reflow(elt) {
    elt.offsetHeight;
}
