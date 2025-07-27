import CardImagesPicker from "../Form/CardImagesPicker";
import UploadImage from "../Form/UploadImage";

function DocumentsInformation({ formData, setFormData, title, isPerson, disabled }) {
  const handlePersonImages = (fileObj) => {
    setFormData({ ...formData, ...fileObj });
  };

  const handleOtherImages = (files) => {
    setFormData({ ...formData, othreFiles: files });
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 my-4">
      <p className="text-2xl text-neutral-500 font-normal">{title}</p>
      <div className="mt-4">
        {isPerson && (
          <>
            <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
              <CardImagesPicker
                title="البطاقة الوطنية"
                frontKey="nationalIdFrontFile"
                backKey="nationalIdBackFile"
                disabled={disabled}
                formData={{
                  frontImage:
                    typeof formData.nationalIdFrontFile === "string"
                      ? formData.nationalIdFrontFile
                      : formData.nationalIdFrontFile
                      ? URL.createObjectURL(formData.nationalIdFrontFile)
                      : "",
                  backImage:
                    typeof formData.nationalIdBackFile === "string"
                      ? formData.nationalIdBackFile
                      : formData.nationalIdBackFile
                      ? URL.createObjectURL(formData.nationalIdBackFile)
                      : "",
                }}
                setFormData={handlePersonImages}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
              <CardImagesPicker
                title="البطاقة السكن"
                frontKey="residenceCardFrontFile"
                backKey="residenceCardBackFile"
                disabled={disabled}
                formData={{
                  frontImage:
                    typeof formData.residenceCardFrontFile === "string"
                      ? formData.residenceCardFrontFile
                      : formData.residenceCardFrontFile
                      ? URL.createObjectURL(formData.residenceCardFrontFile)
                      : "",
                  backImage:
                    typeof formData.residenceCardBackFile === "string"
                      ? formData.residenceCardBackFile
                      : formData.residenceCardBackFile
                      ? URL.createObjectURL(formData.residenceCardBackFile)
                      : "",
                }}
                setFormData={handlePersonImages}
              />
            </div>
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <UploadImage
            onChange={(files) => handleOtherImages(files)}
            disabled={disabled}
            oldImages={formData?.othreFiles?.map((file) =>
              typeof file === "string" ? file : URL.createObjectURL(file)
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default DocumentsInformation;
