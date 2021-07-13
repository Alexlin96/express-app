const express = require('express')
const router = express.Router()
const path = require("path")
const fse = require("fs-extra")
const multiparty = require("multiparty")

const UPLOAD_DIR = path.resolve(__dirname, "../", `qiepian`) // 切片存储目录

router.post('/upload', async (req, res) => {
	const multipart = new multiparty.Form()

	multipart.parse(req, async (err, fields, files) => {
		if (err) {
			return;
		}
		const [file] = files.file;
		const [fileName] = fields.fileName;
		const [chunkName] = fields.chunkName;

		// 保存切片的文件夹的路径，比如  林俊杰 - 交换余生.flac-chunks
		const chunkDir = path.resolve(UPLOAD_DIR, `${fileName}-chunks`);
		// // 切片目录不存在，创建切片目录
		if (!fse.existsSync(chunkDir)) {
				await fse.mkdirs(chunkDir);
		}
		// 把切片移动到切片文件夹
		await fse.move(file.path, `${chunkDir}/${chunkName}`);
		res.json({
      code: 200,
      msg: '切片上传成功',
      data: null
    })
	})
})

const pipeStream = (path, writeStream) => {
	return new Promise(resolve => {
		const readStream = fse.createReadStream(path);
		readStream.on("end", () => {
			fse.unlinkSync(path)
			resolve();
		})
		readStream.pipe(writeStream)
	})
}

// 合并切片
const mergeFileChunk = async (filePath, fileName, size) => {
	// filePath：你将切片合并到哪里，的路径
	const chunkDir = path.resolve(UPLOAD_DIR, `${fileName}-chunks`)
	let chunkPaths = null
	// 获取切片文件夹里所有切片，返回一个数组
	chunkPaths = await fse.readdir(chunkDir)
	// 根据切片下标进行排序
	// 否则直接读取目录的获得的顺序可能会错乱
	chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
	const arr = chunkPaths.map((chunkPath, index) => {
		return pipeStream(
			path.resolve(chunkDir, chunkPath),
			// 指定位置创建可写流
			fse.createWriteStream(filePath, {
				start: index * size,
				end: (index + 1) * size
			})
		)
	})
	await Promise.all(arr)
	fse.rmdir(chunkDir); // 合并后删除保存切片的目录
};

router.post('/merge', async (req, res) => {
	const data = req.body
	const { fileName, size } = data
	const filePath = path.resolve(UPLOAD_DIR, fileName)
	await mergeFileChunk(filePath, fileName, size)
	res.json({
		code: 200,
		msg: '文件合并成功',
		data: null
	})
})

module.exports = router;