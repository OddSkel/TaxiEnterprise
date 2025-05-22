const Conforto = require('../models/conforto');

exports.getConfortos = async(req,res,next) => {
    try {
        const confortos = await Conforto.find().sort().exec();
        res.json(confortos);
    } catch (error){
        console.error("Error fetching taxis:", error);
        res.status(500).json({ message: "Error fetching taxis", error });
    }
};

exports.conforto_details = async(req, res, next) => {
  const conforto = await Conforto.findOne({name: req.params.id})
  console.log(conforto);

  if (conforto === null) {
    // No results.
    const err = new Error("Conforto não foi encontrado!");
    res.status(404).json({message: err});
  }

  res.json(conforto);
};

exports.conforto_update = async(req,res,next) => {
  try {
    console.log("This is reached!");
    const conforto  = req.body;
    const id = conforto._id;
    const updateConforto = await Conforto.findByIdAndUpdate(id,{acrescimo: req.body.acrescimo,
    preco: req.body.preco}).exec();
    updateConforto
      ? res.json(updateConforto)
      : res.status(404).json({ message: "Didn't find that level of confort" });
  } catch (error) {
    return next(error);
  }
};

exports.getConfortoByName = async (req, res,next) => {
  try {
    const conforto = await Conforto.findOne({ name: req.params.id });

    if (conforto === null) {
      const err = new Error("Conforto não foi encontrado!");
      return res.status(404).json({ message: err.message }); // <-- return aqui
    }

    console.log("Conforto: ", conforto);
    return res.status(200).json(conforto);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao buscar conforto." });
  }
};
