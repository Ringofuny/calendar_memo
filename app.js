const calendar =
document.getElementById("calendar");

const monthLabel =
document.getElementById("monthLabel");

let selectedDate = new Date();

let displayDate =
new Date();

function formatDate(date){

    const y =
    date.getFullYear();

    const m =
    String(
        date.getMonth()+1
    ).padStart(2,"0");

    const d =
    String(
        date.getDate()
    ).padStart(2,"0");

    return `${y}-${m}-${d}`;
}

function loadMemos(){

    return JSON.parse(
        localStorage.getItem("memos")
        || "[]"
    );
}

function saveMemos(memos){

    localStorage.setItem(
        "memos",
        JSON.stringify(memos)
    );
}

function renderCalendar(){

calendar.innerHTML="";

const year =
displayDate.getFullYear();

const month =
displayDate.getMonth();

monthLabel.textContent =
`${year}年 ${month+1}月`;

const firstDay =
new Date(year,month,1)
.getDay();

const daysInMonth =
new Date(year,month+1,0)
.getDate();

for(let i=0;i<firstDay;i++){

    const blank =
    document.createElement("div");

    calendar.appendChild(blank);
}

const memos = loadMemos();

for(let day=1;
    day<=daysInMonth;
    day++){

    const date =
    new Date(year,month,day);

    const cell =
    document.createElement("div");

    cell.className="day";

    cell.textContent=day;

    if(
        formatDate(date)
        ===
        formatDate(new Date())
    ){
        cell.classList.add(
        "today");
    }

    if(
        formatDate(date)
        ===
        formatDate(selectedDate)
    ){
        cell.classList.add(
        "selected");
    }

    if(
        memos.some(
        m =>
        m.date===formatDate(date)
        )
    ){
        cell.classList.add(
        "hasMemo");
    }

    cell.onclick=()=>{

        selectedDate=date;

        renderCalendar();
        renderMemoList();
    };

    calendar.appendChild(cell);
}
}

const selectedDateLabel =
document.getElementById(
    "selectedDate"
);

const memoList =
document.getElementById(
    "memoList"
);

function renderMemoList(){

    selectedDateLabel.textContent =
    selectedDate.toLocaleDateString(
        "ja-JP",
        {
            year:"numeric",
            month:"long",
            day:"numeric"
        }
    );

    const memos =
    loadMemos().filter(
        memo =>
        memo.date ===
        formatDate(selectedDate)
    );

    memoList.innerHTML = "";

    if(memos.length === 0){

        memoList.innerHTML =
        `
        <div class="memo">
            メモはありません
        </div>
        `;

        return;
    }

    memos.forEach(memo=>{

        const div =
        document.createElement("div");

        div.className="memo";

        div.innerHTML=
        `
        <h3>${memo.title}</h3>

        <p>${memo.content}</p>

        <button
        onclick="deleteMemo('${memo.id}')">
            削除
        </button>
        `;

        memoList.appendChild(div);
    });
}

document
.getElementById("saveBtn")
.addEventListener(
"click",
()=>{

    const title =
    document
    .getElementById(
        "titleInput"
    )
    .value
    .trim();

    const content =
    document
    .getElementById(
        "contentInput"
    )
    .value
    .trim();

    if(!title){

        alert(
        "タイトルを入力してください"
        );

        return;
    }

    const memos =
    loadMemos();

    memos.push({

        id:
        crypto.randomUUID(),

        title,

        content,

        date:
        formatDate(
            selectedDate
        )
    });

    saveMemos(memos);

    document
    .getElementById(
        "titleInput"
    )
    .value="";

    document
    .getElementById(
        "contentInput"
    )
    .value="";

    renderCalendar();
    renderMemoList();
});

function deleteMemo(id){

    const memos =
    loadMemos().filter(
        memo =>
        memo.id !== id
    );

    saveMemos(memos);

    renderCalendar();
    renderMemoList();
}

document
.getElementById("prevBtn")
.onclick=()=>{

    displayDate =
    new Date(

        displayDate
        .getFullYear(),

        displayDate
        .getMonth()-1,

        1
    );

    renderCalendar();
};

document
.getElementById("nextBtn")
.onclick=()=>{

    displayDate =
    new Date(

        displayDate
        .getFullYear(),

        displayDate
        .getMonth()+1,

        1
    );

    renderCalendar();
};

renderCalendar();
renderMemoList();
