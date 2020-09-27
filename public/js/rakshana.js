var modal = document.getElementById("postItemModal");

// Get the button that opens the modal
var btn = document.getElementById("postbtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//tabs for your items
function openTab(evt, tab){
  var i, tabc, tabl;

  tabc=document.getElementsByClassName("tabcontent");
  for(i=0; i<tabc.length;i++){
    tabc[i].style.display="none";
  }

  tabl=document.getElementsByClassName("tablinks");
  for(i=0;i<tabl.length;i++){
    tabl[i].className = tabl[i].className.replace(" active","");
  }

  document.getElementById(tab).style.display="block";
  evt.currentTarget.className+=" active";
}

//upload button