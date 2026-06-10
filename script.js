const calendarEl = document.getElementById("calendar");
const monthTitleEl = document.getElementById("monthTitle");
const selectedDateEl = document.getElementById("selectedDate");

let selectedDate = new Date();

let currentMonth =
    new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
    );

function loadMemos() {
    return JSON.parse(
        localStorage.getItem("memos") || "[]"
    );
}

function saveMemos(memos) {
    localStorage.setItem(
        "memos",
        JSON.stringify(memos)
    );
}

function formatDate(date) {

    const y = date.getFullYear();

    const m =
        String(date.getMonth() + 1)
        .padStart(2, "0");

    const d =
        String(date.getDate())
        .padStart(2, "0");

    return `${y}-${m}-${d}`;
}

function renderCalendar() {

    calendarEl.innerHTML = "";

    const year =
        currentMonth.getFullYear();

    const month =
        currentMonth.getMonth();

    monthTitleEl.textContent =
        `${year}年 ${month + 1}月`;

    const firstDay =
        new Date(year, month, 1).getDay();

    const daysInMonth =
        new Date(year, month + 1, 0)
        .getDate();

    for(let i=0;i<firstDay;i++){

        const blank =
            document.createElement("div");

        calendarEl.appendChild(blank);
    }

    const memos = loadMemos();

    for(let day=1; day<=daysInMonth; day++){

        const date =
            new Date(year, month, day);

        const dateStr =
            formatDate(date);

        const div =
            document.createElement("div");

        div.classList.add("day");

        const today = new Date();

        if(
            formatDate(today)
            === dateStr
        ){
            div.classList.add("today");
        }

        if(
            formatDate(selectedDate)
            === dateStr
        ){
            div.classList.add("selected");
        }

        if(
            memos.some(
                m => m.date === dateStr
            )
        ){
            div.classList.add("hasMemo");
        }

        div.textContent = day;

        div.onclick = () => {

            selectedDate = date;

            renderCalendar();
            renderMemoList();
        };

        calendarEl.appendChild(div);
    }
}

function renderMemoList(){

    selectedDateEl.textContent =
        formatDate(selectedDate);

    const memoList =
        document.getElementById(
            "memoList"
        );

    memoList.innerHTML = "";

    const memos =
        loadMemos().filter(
            memo =>
            memo.date ===
            formatDate(selectedDate)
        );

    if(memos.length===0){

        memoList.innerHTML =
            "<p>メモなし</p>";

        return;
    }

    memos.forEach(memo => {

        const div =
            document.createElement("div");

        div.className = "memo";

        div.innerHTML = `
            <b>${memo.title}</b><br>
            ${memo.content}<br><br>
            <button onclick="deleteMemo('${memo.id}')">
                削除
            </button>
        `;

        memoList.appendChild(div);
    });
}

function saveMemo(){

    const title =
        document.getElementById("title")
        .value;

    const content =
        document.getElementById("content")
        .value;

    if(!title) return;

    const memos = loadMemos();

    memos.push({
        id: crypto.randomUUID(),
        title,
        content,
        date: formatDate(selectedDate)
    });

    saveMemos(memos);

    document.getElementById("title").value="";
    document.getElementById("content").value="";

    renderCalendar();
    renderMemoList();
}

function deleteMemo(id){

    const memos =
        loadMemos().filter(
            memo => memo.id !== id
        );

    saveMemos(memos);

    renderCalendar();
    renderMemoList();
}

document
.getElementById("saveButton")
.addEventListener(
    "click",
    saveMemo
);

document
.getElementById("prevMonth")
.onclick = () => {

    currentMonth =
        new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth()-1,
            1
        );

    renderCalendar();
};

document
.getElementById("nextMonth")
.onclick = () => {

    currentMonth =
        new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth()+1,
            1
        );

    renderCalendar();
};

if("serviceWorker" in navigator){

    navigator.serviceWorker
        .register("./service-worker.js");
}

renderCalendar();
renderMemoList();