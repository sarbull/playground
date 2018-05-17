(function () {
  const ModelModule = (function () {
    function Person(name) {
      this.name = name;
    }

    Person.prototype.getName = function () {
      return this.name;
    };

    const p = new Person('Cezar Sirbu');
    console.log(p.getName());

    return {
      Person: Person
    };
  })();


  (function () {
    const p = new ModelModule.Person('Cezar Sirbu 2');

    console.log(p.getName());
  })();
})();