import Matter, { IEventTimestamped, Engine as IEngine } from "matter-js";
const {
  Bodies,
  Body,
  Composite,
  Render,
  Engine,
  Runner,
  Mouse,
  MouseConstraint,
  Events
} = Matter;

class Manipulation {
  private engine: Matter.Engine;
  private runner: Matter.Runner;
  private render: Matter.Render;
  private canvas: HTMLCanvasElement;
  private world: Matter.World;

  constructor() {
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.canvas = document.body.querySelector("#c2") as HTMLCanvasElement;

    this.render = Render.create({
      element: document.body,
      canvas: this.canvas,
      engine: this.engine,
      options: {
        width: 800,
        height: 600,
      },
    });

    Render.run(this.render);

    // create runner
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);

    const bodyA = Bodies.rectangle(100, 300, 50, 50, {
        isStatic: true,
        render: { fillStyle: "#060a19" },
      }),
      bodyB = Bodies.rectangle(200, 200, 50, 50),
      bodyC = Bodies.rectangle(300, 200, 50, 50),
      bodyD = Bodies.rectangle(400, 200, 50, 50),
      bodyE = Bodies.rectangle(550, 200, 50, 50),
      bodyF = Bodies.rectangle(700, 200, 50, 50),
      bodyG = Bodies.circle(400, 100, 25, { render: { fillStyle: "#060a19" } });

    const partA = Bodies.rectangle(600, 200, 120 * 0.8, 50 * 0.8, {
        render: { fillStyle: "#060a19" },
      }),
      partB = Bodies.rectangle(660, 200, 50 * 0.8, 190 * 0.8, {
        render: { fillStyle: "#060a19" },
      }),
      compound = Body.create({
        parts: [partA, partB],
        isStatic: true,
      });

    Body.setPosition(compound, { x: 600, y: 300 });

    Composite.add(this.world, [
      bodyA,
      bodyB,
      bodyC,
      bodyD,
      bodyE,
      bodyF,
      bodyG,
      compound,
    ]);

    const walls =  [
      Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ]
    Composite.add(this.world, walls);

    let lastTime = 0,
      scaleRate = 0.6;
      

    Events.on(this.engine, "beforeUpdate", function (event: IEventTimestamped<IEngine>) {
      // @ts-expect-error
      const timeScale = (event?.delta ?? 1000 / 60) / 1000;
      
      if (scaleRate > 0) {
        Body.scale(bodyF, 1 + scaleRate * timeScale, 1 + scaleRate * timeScale);

        // modify bodyE vertices
        bodyE.vertices[0].x -= 0.2 * timeScale;
        bodyE.vertices[0].y -= 0.2 * timeScale;
        bodyE.vertices[1].x += 0.2 * timeScale;
        bodyE.vertices[1].y -= 0.2 * timeScale;
        Body.setVertices(bodyE, bodyE.vertices);
      }

      // make bodyA move up and down
      var py = 300 + 100 * Math.sin(event.timestamp * 0.002);

      // move body and update velocity
      Body.setPosition(bodyA, { x: 100, y: py });

      // move compound body move up and down and update velocity
      Body.setPosition(compound, { x: 600, y: py });

      // rotate compound body and update angular velocity
      Body.rotate(compound, 1 * Math.PI * timeScale);

      // after first 0.8 sec (simulation time)
      if (event.timestamp >= 800) Body.setStatic(bodyG, true);

      // every 1.5 sec (simulation time)
      if (event.timestamp - lastTime >= 1500) {
        Body.setVelocity(bodyB, { x: 0, y: -10 });
        Body.setAngle(bodyC, -Math.PI * 0.26);
        Body.setAngularVelocity(bodyD, 0.2);

        // stop scaling
        scaleRate = 0;

        // update last time
        lastTime = event.timestamp;
      }
    });

    const mouse = Mouse.create(this.render.canvas),
      mouseConstraint = MouseConstraint.create(this.engine, {
        mouse,
        constraint: {
          stiffness: 0.58,
          render: {
            visible: true,
          },
        },
      });

    Composite.add(this.world, mouseConstraint);

    // keep the mouse in sync with rendering
    this.render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(this.render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 },
    });
  }


  public stop(): void {
    Render.stop(this.render);
    Runner.stop(this.runner);
  }

  static title = "Manipulation";
  static for = ">=0.14.2";
}

export default Manipulation;
