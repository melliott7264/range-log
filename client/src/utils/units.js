class Units {
  constructor(
    measureInch,
    measureMass,
    measureSpeed,
    measureTemp,
    measureYards,
    measureInches,
    measureVelocity
  ) {
    // initialize units of measure
    this.measureInches = '(in)';
    this.measureInch = ' (.001")';
    this.measureSpeed = ' (Mph)';
    this.measureTemp = ' (F)';
    this.measureMass = ' (gr)';
    this.measureYards = ' (yds)';
    this.measureVelocity = ' (ft/s)';
  }
  switchUnits(metric) {
    if (metric === true) {
      this.measureInches = ' (mm)';
      this.measureInch = ' (0.01mm)';
      this.measureSpeed = ' (Kph)';
      this.measureTemp = ' (C)';
      this.measureMass = ' (g)';
      this.measureYards = ' (m)';
      this.measureVelocity = ' (m/s)';
    } else {
      this.measureInches = '(in)';
      this.measureInch = ' (.001")';
      this.measureSpeed = ' (Mph)';
      this.measureTemp = ' (F)';
      this.measureMass = ' (gr)';
      this.measureYards = ' (yds)';
      this.measureVelocity = ' (ft/s)';
    }
    return true;
  }
}

export default new Units();
