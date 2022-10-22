class Units {
  constructor(
    measureInch,
    measureMass,
    measureSpeed,
    measureTemp,
    measureYards
  ) {
    // initialize units of measure
    // let measureInches = ' (in)';
    this.measureInch = ' (.001")';
    this.measureSpeed = ' (Mph)';
    this.measureTemp = ' (F)';
    this.measureMass = ' (gr)';
    this.measureYards = ' (yds)';
  }
  switchUnits(metric) {
    if (metric === true) {
      // measureInches = ' (mm)';
      this.measureInch = ' (0.01mm)';
      this.measureSpeed = ' (Kph)';
      this.measureTemp = ' (C)';
      this.measureMass = ' (g)';
      this.measureYards = ' (m)';
    } else {
      this.measureInch = ' (.001")';
      this.measureSpeed = ' (Mph)';
      this.measureTemp = ' (F)';
      this.measureMass = ' (gr)';
      this.measureYards = ' (yds)';
    }
    return true;
  }
}

export default new Units();
