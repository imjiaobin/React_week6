export const userValidation = {
  required: "請輸入使用者名稱",
  minLength: {
    value: 1,
    message: "使用者名稱最少1個字",
  },
};
export const passwordValidation = {
  required: "請輸入密碼!",
  minLength: {
    value: 6,
    message: "密碼至少6碼!",
  },
};

export const emailValidation = {
  required: "請輸入Email!",
  pattern: {
    value: /^\S+@\S+$/i,
    message: "Email格式不正確",
  },
};

export const telValidation = {
  required: "請輸入電話號碼",
  minLength: {
    value: 8,
    message: "手機號碼最少8碼",
  },
  maxLength: {
    value: 10,
    message: "手機號碼最多10碼",
  },
  pattern: {
    value: /^\d+$/,
    message: "電話僅能輸入數字",
  },
};
