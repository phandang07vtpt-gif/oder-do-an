const ZALO_PHONE = "0835324126";
const TOTAL_TABLES = 26;
const MENU_ITEMS = [
  "1. Set heo độc bản",
  "2. Set bò lam khó",
  "3. Set bò tươi",
  "4. Set mộc hương",
];

let currentTable = null;
let quantities = [0, 0, 0, 0];

// 1. Tạo tự động 26 nút bàn
const tableListEl = document.getElementById("table-list");
for (let i = 1; i <= TOTAL_TABLES; i++) {
  const btn = document.createElement("button");
  btn.className = "table-btn";
  btn.innerText = "Bàn " + i;
  btn.onclick = () => selectTable(i, btn);
  tableListEl.appendChild(btn);
}

// 2. Xử lý khi bấm chọn bàn
function selectTable(tableNumber, btnElement) {
  currentTable = tableNumber;

  // Đổi màu nút đang chọn
  document
    .querySelectorAll(".table-btn")
    .forEach((b) => b.classList.remove("active"));
  btnElement.classList.add("active");

  // Reset số lượng món và ghi chú cho lượt order mới
  quantities = [0, 0, 0, 0];
  document.getElementById("custom-items").value = "";
  document.getElementById("order-note").value = "";

  // Cập nhật tiêu đề và hiển thị khung chọn món
  document.getElementById("selected-table-title").innerText =
    "Thực đơn - Bàn " + tableNumber;
  document.getElementById("order-section").style.display = "block";

  renderMenu();
  // Cuộn mượt xuống phần chọn món (tiện khi dùng điện thoại)
  document
    .getElementById("order-section")
    .scrollIntoView({ behavior: "smooth" });
}

// 3. Hiển thị danh sách món và nút tăng/giảm số lượng
function renderMenu() {
  const menuListEl = document.getElementById("menu-list");
  menuListEl.innerHTML = "";

  MENU_ITEMS.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `
            <span>${item}</span>
            <div class="qty-controls">
                <button onclick="changeQty(${index}, -1)">-</button>
                <span id="qty-${index}">${quantities[index]}</span>
                <button onclick="changeQty(${index}, 1)">+</button>
            </div>
        `;
    menuListEl.appendChild(div);
  });
}

// 4. Tăng/giảm số lượng món
function changeQty(index, delta) {
  if (quantities[index] + delta >= 0) {
    quantities[index] += delta;
    document.getElementById(`qty-${index}`).innerText = quantities[index];
  }
}

// 5. Tạo nội dung đơn hàng và mở Zalo
function sendToZalo() {
  if (!currentTable) {
    alert("Vui lòng chọn bàn trước!");
    return;
  }

  let orderLines = [];
  MENU_ITEMS.forEach((item, index) => {
    if (quantities[index] > 0) {
      orderLines.push(`- ${item}: ${quantities[index]} set`);
    }
  });

  const customItems = document
    .getElementById("custom-items")
    .value.split("\n")
    .map((item) => item.trim())
    .filter((item) => item !== "");
  customItems.forEach((item) => orderLines.push(`- ${item}`));

  if (orderLines.length === 0) {
    alert("Bạn chưa chọn món nào!");
    return;
  }

  const note = document.getElementById("order-note").value.trim();

  // Soạn nội dung tin nhắn
  let message = `ORDER MỚI - BÀN ${currentTable}\n`;
  message += `------------------\n`;
  message += orderLines.join("\n");
  if (note !== "") {
    message += `\n------------------\nGhi chú: ${note}`;
  }

  const encodedText = encodeURIComponent(message);
  const zaloUrl = `https://zalo.me/${ZALO_PHONE}?text=${encodedText}`;

  // Chuyển thẳng sang Zalo trên điện thoại
  window.location.href = zaloUrl;
}
