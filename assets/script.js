document.addEventListener("DOMContentLoaded", function () {
  const authToggle = document.getElementById("auth-toggle");
  const authModal = document.getElementById("auth-modal");
  const authForm = document.getElementById("auth-form");
  const authTitle = document.getElementById("auth-title");
  const toggleAuthButton = document.getElementById("toggle-auth");
  const closeModalButton = document.getElementById("close-modal");
  const bookList = document.getElementById("book-list");
  const categoryList = document.getElementById("category-list");

  let isSignUp = true;

  function toggleAuthMode() {
    isSignUp = !isSignUp;
    authTitle.textContent = isSignUp ? "Sign Up" : "Sign In";
    toggleAuthButton.textContent = isSignUp ? "Sign In" : "Sign Up";
    document.getElementById("username").style.display = isSignUp
      ? "block"
      : "none";
    document.getElementById("email").style.display = "block";
    document.getElementById("confirm-password").style.display = isSignUp
      ? "block"
      : "none";
  }

  function showModal() {
    authModal.classList.remove("hidden");
    authModal.classList.add("modal-enter");
    requestAnimationFrame(() => {
      authModal.classList.add("modal-enter-active");
      authModal.classList.remove("modal-enter");
    });
  }

  function hideModal() {
    authModal.classList.add("modal-leave");
    requestAnimationFrame(() => {
      authModal.classList.add("hidden");
      authModal.classList.remove("modal-leave");
    });
  }

  authToggle.addEventListener("click", showModal);
  closeModalButton.addEventListener("click", hideModal);
  toggleAuthButton.addEventListener("click", toggleAuthMode);

  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (isSignUp) {
      // Sign Up
      if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      if (password.length < 6) {
        alert("Password must be at least 6 characters long!");
        return;
      }
      if (localStorage.getItem(email)) {
        alert("Email already exists!");
        return;
      }
      const user = { username, email, password };
      localStorage.setItem(email, JSON.stringify(user));
      alert("User registered successfully!");
    } else {
      // Sign In
      const emailOrPassword = email || password;
      let user = null;

      // Check if input is an email
      if (emailOrPassword.includes("@")) {
        user = JSON.parse(localStorage.getItem(emailOrPassword));
        if (!user || user.password !== password) {
          alert("Invalid email or password!");
          return;
        }
      } else {
        // If not an email, search for user by password
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const storedUser = JSON.parse(localStorage.getItem(key));
          if (storedUser && storedUser.password === emailOrPassword) {
            user = storedUser;
            break;
          }
        }
        if (!user) {
          alert("Invalid password!");
          return;
        }
      }
      alert("Signed in successfully!");
    }

    hideModal();
    authForm.reset();
  });

  const toggleSwitch = document.getElementById("toggle-switch");
  const body = document.body;

  toggleSwitch.addEventListener("change", () => {
    if (toggleSwitch.checked) {
      body.classList.add("dark-mode");
      body.classList.remove("light-mode");
    } else {
      body.classList.add("light-mode");
      body.classList.remove("dark-mode");
    }
    updateBookItemStyles();
  });

  function updateBookItemStyles() {
    const bookItems = document.querySelectorAll(".book-item");
    const bookAuthors = document.querySelectorAll(".book-item p");
    bookItems.forEach((item) => {
      item.classList.toggle("text-white", body.classList.contains("dark-mode"));
    });
    bookAuthors.forEach((author) => {
      author.classList.toggle(
        "text-gray-400",
        body.classList.contains("dark-mode")
      );
      author.classList.toggle(
        "text-gray-600",
        !body.classList.contains("dark-mode")
      );
    });
  }

  // Fetch categories and books
  fetch("https://books-backend.p.goit.global/books/category-list")
    .then((response) => response.json())
    .then((categories) => {
      categories.sort((a, b) => a.list_name.localeCompare(b.list_name));
      categories.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category.list_name;
        button.setAttribute("data-category", category.list_name);
        button.classList.add(
          "filter-btn",
          "transition-all",
          "text-start",
          "text-gray-500",
          "duration-300",
          "hover:text-blue-700"
        );
        categoryList.appendChild(button);
      });
    })
    .catch((error) => console.error("Error fetching categories:", error));

  categoryList.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-btn")) {
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active-category");
        btn.classList.add("text-gray-500");
      });
      e.target.classList.add("active-category");
      e.target.classList.remove("text-gray-500");
      const category = e.target.getAttribute("data-category");
      fetchBooksByCategory(category);
    }
  });

  function fetchBooksByCategory(category) {
    fetch(`https://books-backend.p.goit.global/books/top-books`)
      .then((response) => response.json())
      .then((books) => {
        if (category === "All") {
          displayBooks(books.flatMap((cat) => cat.books));
        } else {
          const categoryBooks = books.find((cat) => cat.list_name === category);
          if (categoryBooks) {
            displayBooks(categoryBooks.books);
          }
        }
      })
      .catch((error) => console.error("Error fetching books:", error));
  }

  function displayBooks(books) {
    bookList.innerHTML = "";
    books.forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.classList.add(
        "book-item",
        "p-4",
        "rounded-lg",
        "cursor-pointer"
      );
      bookItem.innerHTML = `
                <div class="relative">
                    <img src="${book.book_image}" alt="${book.title}" class="img-card object-cover rounded-lg mb-4">
                    <div class="bottom-overlay rounded-b-lg">
                        <p class="">QUICK VIEW</p>
                    </div>
                </div>
                <h3 class="text-md text-start font-semibold">${book.title}</h3>
                <p class="text-xs text-start text-gray-600">${book.author}</p>
            `;
      bookItem.addEventListener("click", () => showBookDetails(book));
      bookList.appendChild(bookItem);
    });
    updateBookItemStyles();
  }

  function showBookDetails(book) {
    const modal = document.createElement("div");
    modal.classList.add(
      "fixed",
      "inset-0",
      "bg-gray-600",
      "bg-opacity-50",
      "overflow-y-auto",
      "h-full",
      "w-full",
      "flex",
      "items-center",
      "justify-center",
      "z-50"
    );

    console.log("book", book);
    modal.innerHTML = `
            <div class="bg-white  p-8 rounded-lg shadow-xl max-w-lg w-full">
                <div class="flex gap-4">
                   <img src="${book.book_image}" alt="${
      book.title
    }" class="h-[35vh] object-cover rounded-lg mb-4">
                <div class="flex gap-7 justify-between items-start mb-4">
                    <div class="flex flex-col gap-3">
                        <h2 class="text-xl font-bold text-start">${
                          book.title
                        }</h2>
                        <p class="text-sm text-start text-gray-400 font-semibold mb-2">${
                          book.author
                        }</p>
                        <p class="text-sm mb-4 text-start">${
                          book.description ||
                          "There is no description of this book."
                        }</p>

                        <div class="flex justify-between items-center">
                              <a href="${
                                book.amazon_product_url
                              }"><img src="/assets/img/amazon-shop.png" alt="amazon-shop"></a>
                              <a href=""><img src="/assets/img/apple-shop.png" alt="apple-shop"></a>
                              <a href=""><img src="/assets/img/bookshop.png" alt="bookshop"></a>
                        
                        </div>
                    </div>
                    <button class="text-gray-500 hover:text-gray-700 close-modal">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                </div>
                <button class="w-full p-2 rounded-full mt-4 border border-blue-600 hover:bg-blue-600 hover:text-white font-bold text-xl">ADD TO SHOPPING LIST</button>
            </div>
            
        `;

    document.body.appendChild(modal);

    modal.querySelector(".close-modal").addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  fetchBooksByCategory("All");
  document
    .querySelector('[data-category="All"]')
    .classList.add("active-category");
});
