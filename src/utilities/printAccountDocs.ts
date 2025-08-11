export function printAccountDocs({
  nationalIdFrontFile,
  nationalIdBackFile,
  residenceCardFrontFile,
  residenceCardBackFile,
}: {
  nationalIdFrontFile?: string;
  nationalIdBackFile?: string;
  residenceCardFrontFile?: string;
  residenceCardBackFile?: string;
}) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>طباعة المستندات</title>
        <style>
          @media print {
            body { margin: 0; }
            .img-row { display: flex; justify-content: space-between; margin-bottom: 0; }
            .img-col { width: 49%; text-align: center; }
            img {
              display: block;
              margin: 0 auto 0 auto;
              border: none;
              page-break-inside: avoid;
            }
            .national-id { width: 8.6cm; height: 5.4cm; }
            .residence-card { width: 10.5cm; height: 7.4cm; }
          }
          body { direction: rtl; margin: 0; }
          .img-row { display: flex; justify-content: space-between; margin-bottom: 0; }
          .img-col { width: 49%; text-align: center; }
          img {
            display: block;
            margin: 0 auto 0 auto;
            border: none;
          }
          .national-id { width: 8.6cm; height: 5.4cm; }
          .residence-card { width: 10.5cm; height: 7.4cm; }
        </style>
      </head>
      <body>
        <div class="img-row">
          <div class="img-col">
            <img class="national-id" src="${nationalIdFrontFile || ''}" alt="" />
          </div>
          <div class="img-col">
            <img class="national-id" src="${nationalIdBackFile || ''}" alt="" />
          </div>
        </div>
        <div class="img-row">
          <div class="img-col">
            <img class="residence-card" src="${residenceCardFrontFile || ''}" alt="" />
          </div>
          <div class="img-col">
            <img class="residence-card" src="${residenceCardBackFile || ''}" alt="" />
          </div>
        </div>
        <script>
          // Wait for all images to load before printing
          const images = Array.from(document.images);
          let loaded = 0;
          if (images.length === 0) {
            window.print();
          } else {
            images.forEach(img => {
              if (img.complete) {
                loaded++;
                if (loaded === images.length) window.print();
              } else {
                img.onload = img.onerror = () => {
                  loaded++;
                  if (loaded === images.length) window.print();
                };
              }
            });
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
}