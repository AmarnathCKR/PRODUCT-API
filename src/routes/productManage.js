const router = require("express").Router();

const userAuth = require("../middlewares/userAuth");
const { deleteProduct, getProduct, fetchAllProduct, createProduct } = require("../controller/product/productController");
const { validateProduct } = require("../middlewares/userValidater");

router.get("/", fetchAllProduct)

router.post("/", validateProduct ,createProduct)

router.delete("/:productId", deleteProduct)

router.get("/:productId", getProduct)

module.exports = router;