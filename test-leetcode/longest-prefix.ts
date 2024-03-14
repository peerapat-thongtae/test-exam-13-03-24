function longestCommonPrefix(arrString: string[]): string {
     let sortedStr = arrString.sort((a,b) => a < b? -1:1)
 
     const firstStr: string = sortedStr?.[0]
     const lastStr: string = sortedStr[sortedStr.length -1]
 
     const results: string[] = []
 
     for (let i = 0; i < firstStr.length; i++) {
         if (firstStr[i] === lastStr[i] ){
             results.push(lastStr[i])
         } else {       
             break
         }
     }
     return results.join('')
 };

 console.log(longestCommonPrefix(["flower","flow","flight"]))
 console.log(longestCommonPrefix(["dog","racecar","car"]))