function addRowHandlers() {
    let rows = document.getElementById('example').rows;
    for(i = 0; i < rows.length; i++ ){
       rows[i].onclick = function() {
           return function() {
               let id = this.cells[0].innerHTML;
               let uname = this.cells[1].innerHTML;
               let isadmin = this.cells[3].innerHTML;
               document.getElementById('userName').innerHTML = uname;
               hiddenId.setAttribute('value', id);
               hiddenAdminId.setAttribute('value', id);
               hiddenRemoveAdminId.setAttribute('value', id);
               if(isadmin == 'Y') {
                   document.getElementById('makeAdminBtn').disabled = true;
                   document.getElementById('removeAdminBtn').disabled = false;
                //    document.getElementById('makeAdminBtn').style.display = 'none';
                //    document.getElementById('removeAdminBtn').style.display = 'block';
               } else {
                   document.getElementById('makeAdminBtn').disabled = false;
                   document.getElementById('removeAdminBtn').disabled = true;
                //    document.getElementById('makeAdminBtn').style.display = 'block';
                //    document.getElementById('removeAdminBtn').style.display = 'none';
               }
           };
       } (rows[i]);
    }
}
window.onload = addRowHandlers();