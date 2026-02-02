export const convertMoney = (num) => {
    const checkNum = Number(num) || 0;
    return checkNum.toLocaleString();
}