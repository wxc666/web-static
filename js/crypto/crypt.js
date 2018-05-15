//aes加密
function AESEncrypt(word) {
    if(typeof(word) == 'object'){
        word = JSON.stringify(word);
    }
    var key = CryptoJS.enc.Utf8.parse($("#cryptoKey").val()); //16位
    var srcs = CryptoJS.enc.Utf8.parse(word);  
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});  
    return encrypted.toString();  
}
// aes解密
function AESDecrypt(word) {
    var key = CryptoJS.enc.Utf8.parse($("#cryptoKey").val()); //16位
    var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});  
    return CryptoJS.enc.Utf8.stringify(decrypt).toString(); 
}
