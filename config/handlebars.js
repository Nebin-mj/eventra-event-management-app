module.exports = {
   extname: ".hbs",
   helpers: {
      eq: (a, b) => a == b,
      formatDate: date => {
         return date
            .toString()
            .split(" ")
            .reduce((acc, curr, i) => {
               if (i <= 4) return acc + " " + curr;
               return acc;
            }, "");
      },
      increment: val => ++val,
      formatBody: body => {
         let regex = /(<([^>]+)>)/gi;
         const truncatedStr = body.replace(regex, " ").substr(0, 100);
         let i;
         for (i = truncatedStr.length; i != 0; i--) {
            if (truncatedStr[i] == " ") break;
         }
         return truncatedStr.substr(0, i) + "....";
      },
   },
};
