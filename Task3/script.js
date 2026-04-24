const inputBox = document.getElementById("input-Box");
const toDo = document.getElementById("toDO");

function addTask() {
  if (inputBox.value.trim() === "") {
    alert("You have to write first!!!");
    return;
  }

  let li = document.createElement("li");

  li.innerHTML = `
    <p style="max-width: 70%;
  overflow: hidden;">${inputBox.value} </p>
    <div class="list_button">
      <button class="complete">Finish</button>
      <button class="delete">Delete</button>
    </div>
  `;

  toDo.appendChild(li);
  inputBox.value = "";
}
toDo.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete")) {
    event.target.closest("li").remove();
  }

  if (event.target.classList.contains("complete")) {
    event.target.closest("li").classList.toggle("checked");
  }
});
const clearBtn = document.querySelector(".clear");

clearBtn.addEventListener("click", function () {
  toDo.innerHTML = "";
});
