let cookies = document.cookie;
let cookies_array = cookies.split(';');

console.log(cookies_array);
for (let i = 0; i < cookies_array.length; i++) {
let name = cookies_array[i].split('=')[0];
name = name.trim();
console.log(name);
if(name == ''){
location.href = '/index';
}
}
