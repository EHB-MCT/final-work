let buzzerCommand = false;

exports.triggerBuzzer = (req, res) => {
  buzzerCommand = true;
  console.log("Buzzer command set");
  res.json({ success: true, message: "Buzzer command set" });
};

exports.checkBuzzer = (req, res) => {
  if (buzzerCommand) {
    // prevent multiple triggers after the first one
    buzzerCommand = false;
    console.log("Buzzer command fetched by hardware");
    return res.json({ buzz: true });
  }
  res.json({ buzz: false });
};
