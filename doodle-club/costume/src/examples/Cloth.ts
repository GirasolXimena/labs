import Matter from "matter-js";

class Cloth {
  private engine: Matter.Engine;
  private runner: Matter.Runner;
  private render: Matter.Render;
  private canvas: HTMLCanvasElement;
  private world: Matter.World;

  constructor() {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.canvas = document.body.querySelector('#c') as HTMLCanvasElement;

    this.render = Matter.Render.create({
      element: document.body,
      canvas: this.canvas,
      engine: this.engine,
      options: {
        width: 800,
        height: 600,
      },
    });

    Matter.Render.run(this.render);
    this.runner = Matter.Runner.create();
    Matter.Runner.run(this.runner, this.engine);

    const cloth = this.createCloth(
      200,
      200,
      20,
      12,
      5,
      5,
      false,
      8
    );
    for (let i = 0; i < 20; i++) {
      cloth.bodies[i].isStatic = true;
    }

    Matter.Composite.add(this.world, [
      cloth,
      Matter.Bodies.circle(500, 400, 80, {
        isStatic: true,
        render: { fillStyle: "#060a19" },
      }),
      Matter.Bodies.rectangle(300, 300, 80, 80, {
        isStatic: true,
        render: { fillStyle: "#060a19" },
      }),
      Matter.Bodies.rectangle(400, 609, 800, 50, { isStatic: true }),
    ]);

    const mouse = Matter.Mouse.create(this.render.canvas),
      mouseConstraint = Matter.MouseConstraint.create(this.engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.58,
          render: {
            visible: true,
          },
        },
      });

    Matter.Composite.add(this.world, mouseConstraint);

    // keep the mouse in sync with rendering
    this.render.mouse = mouse;

    // fit the render viewport to the scene
    Matter.Render.lookAt(this.render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 },
    });

  }

  private createCloth(
    xx: number,
    yy: number,
    columns: number,
    rows: number,
    columnGap: number,
    rowGap: number,
    crossBrace: boolean,
    particleRadius: number,
    particleOptions?: Matter.IBodyDefinition,
    constraintOptions?: boolean
  ): Matter.Composite {
    const Body = Matter.Body,
      Bodies = Matter.Bodies,
      Common = Matter.Common,
      Composites = Matter.Composites;

    const group = Body.nextGroup(true);
    particleOptions = Common.extend(
      {
        inertia: Infinity,
        friction: 0.00001,
        collisionFilter: { group: group },
        render: { visible: false },
      },
      !!particleOptions
    );
    constraintOptions = Common.extend(
      { stiffness: 0.06, render: { type: "line", anchors: false } },
      !!constraintOptions
    );

    const cloth = Composites.stack(
      xx,
      yy,
      columns,
      rows,
      columnGap,
      rowGap,
      function (x: number, y: number) {
        return Bodies.circle(x, y, particleRadius, particleOptions);
      }
    );

    Composites.mesh(cloth, columns, rows, crossBrace, constraintOptions);

    cloth.label = "Cloth Body";

    return cloth;
  }

  public stop(): void {
      Matter.Render.stop(this.render);
      Matter.Runner.stop(this.runner);
  }

  static title = "Cloth";
  static for = '>=0.14.2'
}

export default Cloth;


