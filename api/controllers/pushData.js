export const pushData = async (req,res) => {
    console.log(req.body);
    res.send({"ok":1});
}