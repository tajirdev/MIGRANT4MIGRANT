const form = document.querySelector("#fetForm");
const memberName = document.querySelector("#memberName");
const NameError = document.querySelector("#NameError");
const email = document.querySelector("#email");
const emailError = document.querySelector("#emailError");
const Phone = document.querySelector("#Phone");
const phoneError = document.querySelector("#phoneError");
const address = document.querySelector("#address");
const addressError = document.querySelector("#addressError");
const plan = document.querySelector("#plan");
const planError = document.querySelector("#planError");
const date = document.querySelector("#date");
const dateError = document.querySelector("#dateError");
const emName = document.querySelector("#emName");
const emNameError = document.querySelector("#emNameError");
const emNumber = document.querySelector("#emNumber");
const emNumberError = document.querySelector("#emNumberError");
const password = document.querySelector("#password");
const passwordError = document.querySelector("#passwordError");

const termsError = document.querySelector("#termsError");
const confirmPassword = document.querySelector("#confirmPassword");
const ConfirmError = document.querySelector("#ConfirmError");

const pictureError = document.getElementById("pictureError");
const success = document.querySelector("#success");


const phoneChacke = /^[0-9]{10}$/;
const nameParten = /^[A-Za-z\s]+$/;



form.addEventListener("submit",(e)=>{
  e.preventDefault();
  let valid = true;
  NameError.textContent="";
  emailError.textContent = "";
  phoneError.textContent = "";
  addressError.textContent ="";
  planError.textContent = "";
  dateError.textContent = "";
  emNameError.textContent = "";
  emNumberError.textContent = "";
  passwordError.textContent = "";
  termsError.textContent = "";
  ConfirmError.textContent = "";
 
  const picture = document.querySelector("#picture").files.length;
  if (picture === 0) {
    pictureError.textContent = "Please upload your picture.";
    valid = false;
} else {
    pictureError.textContent = "";
}

  if(memberName.value.trim().length < 1 || !nameParten.test(memberName.value)){
    NameError.textContent ="please Enter your Full name";
    valid= false;
  }
  if(!email.value.includes("@") || !email.value.includes(".")){
    emailError.textContent="Please Enter a Valid email";
    valid= false;
  }

  if(!phoneChacke.test(Phone.value) ){
    phoneError.textContent = "Please enter collect number";
    valid=false;

  }
  if (address.value.trim().length < 1 ||!address.value.includes("P.O.BOX")) {
        addressError.textContent = "Address must be at least 5 characters and P.O.BOX";
        valid = false;
      }
   if(plan.value.trim().length<1){
    planError.textContent="Please select your plan from list";
    valid= false;

   }
   if(date.value.trim().length<1){
    dateError.textContent="Fill the date";
    valid= false;
   }
   if(emName.value.trim().length<1 || !nameParten.test(emName.value)){
    emNameError.textContent= "Fill out the Emergency Name";
    valid = false;
   }
   if(!phoneChacke.test(emNumber.value)){
    emNumberError.textContent="Fill out the Emergency Number";
    valid=false;
   }
    if(password.value.trim().length<6){
      passwordError.textContent="Password must be at least 6 characters";
      valid=false;
    }
    if(confirmPassword.value.trim().length<1 || confirmPassword.value !== password.value){
      ConfirmError.textContent="Password does not match";
      valid=false;
    }
        
     const terms = document.querySelector("#terms").checked;
   if(!terms){
    termsError.textContent="please read our tirms"
    valid=false;
   }
   
   if(valid) {
    const successMessage = document.querySelector("#successMessage");
    successMessage.style.display = "block";
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 5000);

        form.reset();
   }
        

       
       
    

        
        

  






  if(!valid){
     e.preventDefault();
        
  }
});
