const router = require("express").Router();
const Address = require("../models/Address");
const addresses = require("../config/addresses.json")

router.get("/addresses", async (req, res) => {
    try {
        const page = parseInt(req.query.page) -1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";
        // let sort = req.query.sort || "rating";
        let city = req.query.city || "All";

        const cityOptions = [
            "Salineno",
            "Falcon Heights",
            "Falcon"
        ];

        city === "All" 
            ? (city = [...cityOptions])
            : (city = req.query.city.split(","));

        // req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

        // let sortBy = {

        // };

        // if (sort[1]) {
        //     sortBy[sort[0]] = sort[1];
        // } else {
        //     sortBy[sort[0]] = "asc";
        // }

        const addresses = await Address.find({ streetName: { $regex: search, $options: "i" } })
			.where("city")
			.in([...city])
			// .sort(sortBy)
			.skip(page * limit)
			.limit(limit);

		const total = await Address.countDocuments({
			city: { $in: [...city] },
			streetName: { $regex: search, $options: "i" },
		});

		const response = {
			error: false,
			total,
			page: page + 1,
			limit,
			cities: cityOptions,
			addresses,
		};

		res.status(200).json(response);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error"})
    }
});


// const insertAddresses = async () => {
//     try {
//         const docs = await Address.insertMany(addresses);
//         return Promise.resolve(docs);
//     } catch (err) {
//         return Promise.reject(err)
//     }
// };

// insertAddresses()
//     .then((docs) => console.log(docs))
//     .catch((err) => console.log(err))

module.exports = router;