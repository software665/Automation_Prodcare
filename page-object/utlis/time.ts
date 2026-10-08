

export function dateTime():string{

    const now = new Date();

     const dateTime =
         `${String(now.getMinutes()).padStart(2, '0')}`
        + `${String(now.getSeconds()).padStart(2, '0')}`;

        const randomLetters = Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase();

    return `${randomLetters}_${dateTime}`;



}