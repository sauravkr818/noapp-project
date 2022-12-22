const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const csvUser = require("../../models/csv");

exports.create = async (req, res) => {
    const totalRecords = [];
    try {
        console.log(
            path.join(__dirname, "../../", "/public/csv/" + req.file.filename)
        );
        fs.createReadStream(
            path.join(__dirname, "../../", "/public/csv/" + req.file.filename)
        )
            .pipe(csv.parse({ headers: true }))
            .on("error", (error) => console.error(error))
            .on("data", (row) => totalRecords.push(row))
            .on("end", async (rowCount) => {
                let t = {
                    email: req.body.email,
                    data: [...totalRecords],
                };
                try {
                    csvUser.update(
                        { email: req.body.email },
                        { $push: { data: [...totalRecords] } },
                        { multi: true },
                        function (err, user) {
                            if (err) {
                                return res.json({ success: false, msg: err });
                            }
                            if (user.modifiedCount === 0) {
                                const users = csvUser.insertMany(t);

                                res.status(200).send({ data: users });
                            } else {
                                res.json({
                                    success: true,
                                    msg: "User has been updated",
                                });
                            }
                        }
                    );
                } catch (err) {
                    res.status(400).json(err);
                }
            });
    } catch (error) {
        res.status(400).json(error);
    }
};
