const button = document.getElementById("button");
const inputTask = document.getElementById("inputTask");
const ul = document.getElementById("UOL");

let array = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
    ul.innerHTML = "";
    array.forEach((task, index) => {
        const li = document.createElement("li");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = task.checked;
        input.addEventListener("change", () => {
            task.checked = input.checked;
            localStorage.setItem("tasks", JSON.stringify(array));
        });

        const span = document.createElement("span");
        span.textContent = task.text;

        const del = document.createElement("button");
        del.textContent = "x";
        del.id = "delete";

        del.addEventListener("click", () => {
            array.splice(index, 1);
            renderTasks();
            localStorage.setItem("tasks", JSON.stringify(array));
        });

        li.appendChild(input);
        li.appendChild(span);
        li.appendChild(del);
        ul.appendChild(li);
    })
}
renderTasks();

button.addEventListener("click", () => {
    if (inputTask.value === "") return;
    array.push({ text: inputTask.value, checked: false });
    renderTasks();
    inputTask.value = "";
    localStorage.setItem("tasks", JSON.stringify(array));
});

inputTask.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        button.click();
    }
});