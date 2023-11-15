

// export const generatePdf = {
//   data() {
//     return {
//       makePdf: {},
//     }
//   },
//   methods: {
//     async generatePdf(content, options) {
//       const toBase64 = (url) =>
//         url
//           ? fetch(url)
//               .then((response) => response.blob())
//               .then(
//                 (blob) =>
//                   new Promise((resolve, reject) => {
//                     const reader = new FileReader()
//                     reader.onloadend = () => resolve(reader.result)
//                     reader.onerror = reject
//                     reader.readAsDataURL(blob)
//                   })
//               )
//           : null

//       let headerBase64 = await toBase64(
//         require("@/assets/Header_PLN_ICON_PLUS.jpg")
//       )

//       pdfMake.vfs = pdfFonts.pdfMake.vfs

//       var html = htmlToPdfmake(content)
//       //       var html = htmlToPdfmake(`
//       //   <div>
//       //     <h1>My title</h1>
//       //     <p>
//       //       This is a sentence with a <strong>bold word</strong>, <em>one in italic</em>,
//       //       and <u>one with underline</u>. And finally <a href="https://www.somewhere.com">a link</a>.
//       //     </p>
//       //     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a elit sed leo eleifend tempor. Aenean vel massa faucibus, eleifend nibh in, mollis elit. Vivamus eu quam a felis rutrum placerat. Pellentesque viverra, magna id bibendum finibus, erat augue pellentesque purus, eget posuere erat libero in magna. Donec sit amet dignissim ex, et placerat elit. Vestibulum tincidunt, nisl eget ultrices ultricies, enim dolor lacinia leo, at faucibus lorem elit non turpis. Pellentesque sit amet pellentesque nisl, nec aliquam risus. Fusce non purus semper, luctus libero vel, eleifend purus. Phasellus eu sapien ac augue consequat porta.</p>
//       //     <p>Pellentesque justo purus, mattis at diam sed, lobortis consectetur felis. Donec aliquet lectus massa, in sodales orci viverra id. Pellentesque aliquam risus vel rutrum tempus. Nulla cursus fermentum ex, elementum faucibus ex consequat tempor. Aliquam suscipit lacus arcu, at accumsan velit porttitor sed. Nullam sit amet malesuada justo, id auctor diam. Morbi non blandit lectus. Nulla et diam arcu. Aliquam congue quam iaculis sapien sagittis, nec auctor turpis vehicula. Vestibulum pellentesque ipsum sapien, et condimentum nibh consequat in. Fusce varius magna nunc, a feugiat metus mollis eget. Nullam aliquam quam ex, ut viverra enim interdum non. Sed at placerat nibh.</p>
//       //     <p>Sed posuere mattis nunc, eget venenatis velit bibendum vel. Mauris volutpat ipsum vel tortor pretium fringilla. Phasellus gravida mollis mauris, eu aliquam augue porttitor quis. Aliquam enim sem, auctor id est quis, blandit semper nibh. Suspendisse potenti. Suspendisse at leo ut quam dictum semper. Integer a lacus sit amet libero volutpat semper in et augue. Cras suscipit tellus a auctor scelerisque.</p>
//       //     <p>Vestibulum vel vestibulum sem. Quisque efficitur feugiat dui, at venenatis mauris rutrum sed. Sed euismod libero quam, at aliquet justo imperdiet nec. Sed fringilla libero at elit lacinia fringilla. Maecenas justo nulla, finibus id lorem et, finibus malesuada lectus. Praesent hendrerit ac velit in pulvinar. Sed hendrerit urna non urna scelerisque posuere. Nam ac lectus ac quam pretium tempus. Nam venenatis, velit eget sodales viverra, massa leo imperdiet urna, a condimentum ante tortor quis quam. Nulla in auctor eros. Curabitur vitae lectus risus. Fusce eu aliquam enim.</p>
//       //     <p>Morbi finibus sed tortor vitae porttitor. In luctus convallis lectus, sed ullamcorper nulla feugiat eu. In hac habitasse platea dictumst. Cras leo augue, tempus vitae nibh quis, tempus blandit nisi. Praesent consectetur nisi ut odio lobortis, sit amet commodo felis tincidunt. Integer nec ullamcorper enim, in sagittis nisi. Mauris a nisi faucibus, dapibus lacus mollis, sodales augue. Phasellus ac rutrum mauris, sit amet volutpat quam. Integer eget posuere purus, a auctor ligula. Ut ac dui vitae lorem pharetra accumsan quis vitae nisl. Cras quam tortor, ornare in finibus non, dignissim non ex. Pellentesque pulvinar pretium arcu, ullamcorper malesuada est molestie sed. Curabitur sed risus sed velit ullamcorper varius. Quisque sed hendrerit lorem, id posuere lorem. Quisque venenatis molestie quam eget feugiat. Fusce efficitur orci mi, eget ultricies urna maximus eu.</p>
//       //   </div>
//       // `)

//       return new Promise((resolve, reject) => {
//         pdfMake
//           .createPdf({
//             content: [html],
//             header: [
//               {
//                 image: headerBase64,
//                 width: 560,
//                 margin: [20, 20],
//               },
//             ],
//             footer: function (currentPage, pageCount) {
//               return [
//                 {
//                   text: currentPage.toString() + " of " + pageCount,
//                   alignment: "center",
//                   margin: [15, 15],
//                 },
//               ]
//             },
//             info: {
//               title: options.title || "Document",
//             },
//             pageMargins: [40, 110, 40, 50],
//           })
//           .getBase64((data) => {
//             resolve("data:application/pdf;base64," + data)
//           })
//         // }).open()
//       })
//     },
//   },
// }
