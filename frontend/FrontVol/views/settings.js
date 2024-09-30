export default class Settings extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
        <div class="center-console">
        <div class="settings-frame">
            <div class="settings-side-bar">
                <a class="settings-btn default">
                    <img src="../images/settings/general.svg" alt="General" class="settings-icon">
                    General
                </a>
                <a class="settings-btn security">
                    <img src="../images/settings/security.svg" alt="General" class="settings-icon">
                    Security
                </a>
                <a class="settings-btn language">
                    <img src="../images/settings/language.svg" alt="General" class="settings-icon">
                    Languages
                </a>
            </div>
            <div class="settings-main">
                
            </div>
        </div>
    </div>
        `;

    var links = document.querySelectorAll(".settings-btn");

    

    function handleClick(e) {
      e.preventDefault();

      var mainContent = document.querySelector(".settings-main");

      while (mainContent.firstChild) {
        mainContent.removeChild(mainContent.firstChild);
      }

      var newElementName = "settings-" + this.classList[1];

      var newElement = document.createElement(newElementName);
      mainContent.appendChild(newElement);
    }

    links.forEach(function (link) {
      link.addEventListener("click", handleClick);
    });
    const defaultLink = document.querySelector(".settings-btn.default")
    defaultLink.click();
  }
}

class Settings_security extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
            <form id="registration-form" class="Settings_security">
                <label class="general-form" for="password">Current Password:</label><br>
                <input class="general-form" type="password" id="Current_password" name="password"><br>
                <label class="general-form" for="password">New Password:</label><br>
                <input class="general-form" type="password" id="New_password" name="password"><br>
                <label class="general-form" for="confirm-password">Confirm Password:</label><br>
                <input class="general-form" type="password" id="confirm_password" name="confirm-password"><br>
                <input class="general-form-submit" id="changepasssubmit" type="submit" value="Save Changes">
            </form>
         
        `;
    var mydata;

    fetch("http://localhost:8000/main/data/", {
      method: "get",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        mydata = data;
        var securitypage = document.getElementById("changepasssubmit");
        if (securitypage) {
          tcheckpass(mydata);
        }
      });
    function tcheckpass(mydata) {
      var form_pass = document.getElementById("changepasssubmit");

      if (form_pass) {
        form_pass.addEventListener("click", function (event) {
          event.preventDefault();
          var Current_password =
            document.getElementById("Current_password").value;
          var New_password = document.getElementById("New_password").value;
          var confirm_password =
            document.getElementById("confirm_password").value;

          var myform = document.querySelector(".Settings_security");

          if (
            tcheckpasswordmatchi(
              myform,
              Current_password,
              New_password,
              confirm_password
            )
          ) {
            var data = {
              myId: mydata.id,
              New_password: New_password,
              Current_password: Current_password,
            };
            var jsonString = JSON.stringify(data);

            fetch(`http://localhost:8000/settings/changepass`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: jsonString,
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("Success:", data);
                var messageElement = document.createElement("p");

                messageElement.className = "message good";
                if (data.Success) {
                  messageElement.textContent = data.Success;
                  myform.prepend(messageElement);
                  setTimeout(function () {
                    myform.removeChild(messageElement);
                  }, 3000);
                } else {
                  messageElement.textContent = data.error;
                  myform.prepend(messageElement);
                  setTimeout(function () {
                    myform.removeChild(messageElement);
                  }, 3000);
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }
        });
      }
    }

    function tcheckpasswordmatchi(
      myform,
      Current_password,
      New_password,
      confirm_password
    ) {
      if (!Current_password || !New_password || !confirm_password) {
        var messageElement = document.createElement("p");

        messageElement.className = "message";

        messageElement.textContent = "entre all passwords";
        myform.prepend(messageElement);
        setTimeout(function () {
          myform.removeChild(messageElement);
        }, 3000);
        return 0;
      }
      if (New_password != confirm_password) {
        var messageElement = document.createElement("p");

        messageElement.className = "message";

        messageElement.textContent = "password not match";
        myform.prepend(messageElement);
        setTimeout(function () {
          myform.removeChild(messageElement);
        }, 3000);
        return 0;
      }
      return 1;
    }
  }

  disconnectedCallback() {}
}

class Settings_language extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
            <form id="language-form">
                <label for="language-select">Choose a language:</label>
                <select class="language-select" name="language">
                    <option value="en">English</option>
                    <option value="fr">French</option>
                </select>
                <button class="language-submit" type="submit">Change Language</button>
            </form>
        `;

        
  }
}

class Settings_default extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = /*html*/`
            <form id="registration-form">
            <div id="submit_text"> </div>
                <label class="general-form" for="first-name">First Name:</label><br>
                <input class="general-form" type="text" id="firstname" name="first-name"><br>
                <label class="general-form" for="last-name">Last Name:</label><br>
                <input class="general-form" type="text" id="lastname" name="last-name"><br>
                <label class="general-form" for="last-name">User Name:</label><br>
                <input class="general-form" type="text" id="username" name="last-name"><br>
                
                <label class="general-form" for="avatar">Select an Avatar:</label><br>
                <div class="svg-avatar-selection">

                </div>
                <input class="general-form"  type="file" id="profile-img" accept="image/*">

                
                
                
                <input id="submitdefault" class="general-form-submit" type="submit" value="Save Changes">
            </form>
            
        `;
    var mydata;

    fetch("http://localhost:8000/main/data/", {
      method: "get",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        mydata = data;
        var defaultpage = document.getElementById("submitdefault");
        if (defaultpage && mydata) {
          ensertdata(mydata);
          tcheckifdatachange(mydata);
        }
      });
    var firstnameInput = document.getElementById("firstname");
    var lastnameInput = document.getElementById("lastname");
    var usernameInput = document.getElementById("username");

    function ensertdata(mydata) {
      if (mydata && mydata.first_name) {
        firstnameInput.placeholder = mydata.first_name;
      } else {
        firstnameInput.placeholder = "Enter your firstname";
      }
      if (mydata && mydata.last_name) {
        lastnameInput.placeholder = mydata.last_name;
      } else {
        lastnameInput.placeholder = "Enter your lastname";
      }
      if (mydata && mydata.username) {
        usernameInput.placeholder = mydata.username;
      } else {
        usernameInput.placeholder = "Enter your username";
      }
    }

    function tcheckifdatachange(mydata) {
      var form = document.getElementById("submitdefault");
      if (form) {
        form.addEventListener("click", function (event) {
          event.preventDefault();
          var firstnameValue = document.getElementById("firstname").value;
          var lastnameValue = document.getElementById("lastname").value;
          var usernameValue = document.getElementById("username").value;
          // var avatar = document.querySelector('.avatar-option.active input[type="radio"]').value;
          var profileImg = document.getElementById("profile-img");



          if (
            (firstnameValue !== "" && firstnameValue !== firstnameInput.placeholder) ||
            (lastnameValue !== "" && lastnameValue !== lastnameInput.placeholder) ||
            (usernameValue !== "" && usernameValue !== usernameInput.placeholder) ||
            (profileImg.files && profileImg.files.length > 0) 
          ) {
            somethingchanged(mydata);
          }
          else{
            var newElement = document.createElement("p");
            newElement.textContent = "change some data";
            newElement.id = "tempElement"; // Assign an id to the new element
            document.getElementById("submit_text").appendChild(newElement);

            setTimeout(function() {
                var element = document.getElementById("tempElement");
                if (element) {
                    element.parentNode.removeChild(element);
                }
            }, 2000);
          }
        });
      }
    }

    function somethingchanged(mydata) {
      var firstnameValue = document.getElementById("firstname").value;
      var lastnameValue = document.getElementById("lastname").value;
      var usernameValue = document.getElementById("username").value;
      var profileImg = document.getElementById("profile-img");
      // var avatar = document.querySelector('.avatar-option.active input[type="radio"]').value;
      var data = {
        myId: mydata.id,
        first_name: firstnameValue,
        last_name: lastnameValue,
        user_name: usernameValue,
        // avatar: avatar,
      };
      let formData = new FormData();
      formData.append('profile-img', profileImg.files[0]);
      formData.append('data', JSON.stringify(data));

      // var jsonString = JSON.stringify(data);
      const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1];
      fetch(`/settings/`, {
        method: "POST",
        headers: {
          'X-CSRFToken': csrftoken 
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    var images = [
      "1_men.svg",
      "2_men.svg",
      "3_men.svg",
      "4_men.svg",
      "5_men.svg",
      "6_men.svg",
      "happy-1.svg",
      "happy-2.svg",
      "happy-3.svg",
      "happy-4.svg",
      "happy-5.svg",
      "happy-6.svg",
    ];

    function generateHTML(image, index) {
      var id = "avatar" + (index + 1);
      var alt = "Avatar " + (index + 1);
      return `
        <div class="avatar-option">
          <input type="radio" id="${id}" name="avatar" value="${image}" hidden>
          <label for="${id}"><img src="../images/users/${image}" alt="${alt}" class="avatar-image"></label>
        </div>
      `;
    }
    
    var avatar_images = images.map(generateHTML).join("\n");
    
    var avatarchose = document.querySelector(".svg-avatar-selection");
    if (avatarchose) avatarchose.innerHTML = avatar_images;
    
    var avatars = document.querySelectorAll(".avatar-option");
    avatars.forEach(function(avatar) {
      avatar.addEventListener('click', function() {
        avatars.forEach(function(otherAvatar) {
          otherAvatar.classList.remove('active');
        });
    
        this.classList.add('active');
      });
    });
}
}

customElements.define("settings-page", Settings);
customElements.define("settings-default", Settings_default);
customElements.define("settings-security", Settings_security);
customElements.define("settings-language", Settings_language);



