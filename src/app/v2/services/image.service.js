//* LIB
const _ = require("lodash");
const fs = require("fs");

//* IMPORT
const cloudinary = require("../../../databases/init.cloudinary");
const { BadRequestRequestError } = require("../../../cores/error.response");

class ImageService {
  async upload(info, { path, folderName = "class/" }) {
    console.log(path, "----");
    if (_.isEmpty(info) || _.isEmpty(path)) {
      await this.removeTmp(path);
      throw new BadRequestRequestError();
    }

    const uploadResult = await cloudinary.uploader.upload(
      path,
      function (res) {
        console.log(res);
      },
      {
        public_id: Date.now() + "thumb",
        folder: folderName + info.id,
        use_filename: true,
      }
    );

    const thumbUrl = await cloudinary.url(uploadResult.public_id, {
      height: 100,
      width: 100,
      format: "jpg",
    });

    return {
      public_id: uploadResult.public_id,
      image_url: uploadResult.secure_url,
      thumb_size: thumbUrl,
      info,
    };
  }
  async uploadMulti(info, { files }, folderName = "class/") {
    if (_.isEmpty(info) || _.isEmpty(files)) {
      throw new BadRequestRequestError();
    }

    const uploadTasks = files.map(async (file) => {
      const result = await cloudinary.uploader.upload(
        file.path,
        {},
        {
          public_id: Date.now() + "thumb",
          folder: folderName + info.id,
        }
      );

      const thumbSize = await cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: "jpg",
      });

      return {
        image_url: result.secure_url,
        shopId: 8409,
        thumb_size: thumbSize,
      };
    });
    return await Promise.all(uploadTasks);
  }

  async removePublicId({ public_id }) {
    if (_.isEmpty(public_id)) {
      throw new BadRequestRequestError();
    }

    const result = await cloudinary.uploader.destroy(public_id, {});

    return result;
  }

  async removeTmp(path) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, (err) => {
        if (err) {
          console.error("Error removing temporary file:", err);
          reject(err);
        } else {
          console.log("Temporary file removed successfully.");
          resolve();
        }
      });
    });
  }
}

module.exports = new ImageService();
