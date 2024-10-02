  export default class Settings extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<loading-page></loading-page>`;
  }

  btnhighlightfun(){
    document.querySelectorAll('.btn-highlight').forEach(el => {
      el.classList.remove('btn-highlight');
  });

  const chatButton = document.getElementById('settingsbtn');

  if (chatButton) {
      chatButton.classList.add('btn-highlight');
  }
}
  connectedCallback() {
    this.btnhighlightfun();
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
    this.mydata = null;
    this.tcheckifdatachange = this.tcheckifdatachange.bind(this);
  }

  somethingchanged() {
    var firstnameValue = document.getElementById("firstname").value;
    var lastnameValue = document.getElementById("lastname").value;
    var usernameValue = document.getElementById("username").value;
    var profileImg = document.getElementById("profile-img");
    // var avatar = document.querySelector('.avatar-option.active input[type="radio"]').value;
    var data = {
      myId: this.mydata.id,
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
      .then((response) => {
        if(response.status === 200)
        {
          const newElement = document.createElement("p");
          newElement.textContent = "Changes done";
          newElement.id = "seccuss";
          document.getElementById("submit_text").appendChild(newElement);
        }
        return response.json();
      })
      .then((data) => {
        this.mydata = data;
        
        var defaultpage = document.getElementById("submitdefault");
        if (defaultpage && this.mydata) {
          this.ensertdata();
          this.tcheckifdatachange();
        }
      });


  
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

  ensertdata() {
    var firstnameInput = document.getElementById("firstname");
    var lastnameInput = document.getElementById("lastname");
    var usernameInput = document.getElementById("username");
    if (this.mydata && this.mydata.first_name) {
      firstnameInput.placeholder = this.mydata.first_name;
    } else {
      firstnameInput.placeholder = "Enter your firstname";
    }
    if (this.mydata && this.mydata.last_name) {
      lastnameInput.placeholder = this.mydata.last_name;
    } else {
      lastnameInput.placeholder = "Enter your lastname";
    }
    if (this.mydata && this.mydata.username) {
      usernameInput.placeholder = this.mydata.username;
    } else {
      usernameInput.placeholder = "Enter your username";
    }
  }




  tcheckifdatachange() {
    const form = document.getElementById("submitdefault");
    if (form) {
      form.addEventListener("click", (event) => {
        event.preventDefault();
  
        // Check for data changes
        const firstnameValue = document.getElementById("firstname").value;
        const lastnameValue = document.getElementById("lastname").value;
        const usernameValue = document.getElementById("username").value;
        const avatarValue = document.getElementById("profile-img").value;
        
        
        // const  avatar = document.querySelector('.avatar-option.active input[type="radio"]').value;
  console.log(avatarValue);
        if (
          (firstnameValue !== "" && firstnameValue !== firstnameValue.placeholder) ||
          (lastnameValue !== "" && lastnameValue !== lastnameValue.placeholder) ||
          (usernameValue !== "" && usernameValue !== usernameValue.placeholder) || 
          (avatarValue !== "")
          (usernameValue !== "" && usernameValue !== usernameValue.placeholder) || 
          (avatarValue !== "")
        ) {
          this.somethingchanged();
        } else {
          // No data changes, display a message
          const newElement = document.createElement("p");
          newElement.textContent = "Please make some changes to your data.";
          newElement.id = "tempElement";
          document.getElementById("submit_text").appendChild(newElement);
  
          setTimeout(() => {
            const element = document.getElementById("tempElement");
            if (element) {
              element.parentNode.removeChild(element);
            }
          }, 2000);
        }
      });
    }
  }

  connectedCallback() {
    this.innerHTML = /*html*/`
            <form id="registration-form">
            <form id="registration-form">
            <div id="submit_text"> </div>
                <label class="general-form" for="first-name">First Name:</label><br>
                <input class="general-form" type="text" id="firstname" name="first-name"><br>
                <label class="general-form" for="last-name">Last Name:</label><br>
                <input class="general-form" type="text" id="lastname" name="last-name"><br>
                <label class="general-form" for="last-name">User Name:</label><br>
                <input class="general-form" type="text" id="username" name="last-name"><br>
                
               
                <input class="general-form"  type="file" id="profile-img" accept="image/*">

                
               
                <input class="general-form"  type="file" id="profile-img" accept="image/*">

                
                
                
                <input id="submitdefault" class="general-form-submit" type="submit" value="Save Changes">
            </form>
            
        `;
    fetch("http://localhost:8000/main/data/", {
      method: "get",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        this.mydata = data;
        var defaultpage = document.getElementById("submitdefault");
        if (defaultpage && this.mydata) {
          this.ensertdata();
          this.tcheckifdatachange();
        }
      });
    var firstnameInput = document.getElementById("firstname");
    var lastnameInput = document.getElementById("lastname");
    var usernameInput = document.getElementById("username");




    fetch("http://localhost:8000/main/data/", {
      method: "get",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        this.mydata = data;
        var defaultpage = document.getElementById("submitdefault");
        if (defaultpage && this.mydata) {
          this.ensertdata();
          this.tcheckifdatachange();
        }
      });
    var firstnameInput = document.getElementById("firstname");
    var lastnameInput = document.getElementById("lastname");
    var usernameInput = document.getElementById("username");



  
    
  }
}
customElements.define("settings-page", Settings);
customElements.define("settings-default", Settings_default);
customElements.define("settings-security", Settings_security);
customElements.define("settings-language", Settings_language);