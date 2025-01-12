import shader from "./shaders.wgsl";

const Initialize = async () => {
  const canvas = document.getElementById("gfx-main") as HTMLCanvasElement;
  const adapter = (await navigator.gpu?.requestAdapter()) as GPUAdapter;
  const device = (await adapter?.requestDevice()) as GPUDevice;
  const context = canvas.getContext("webgpu") as GPUCanvasContext;
  const format = "bgra8unorm" as GPUTextureFormat;
  context.configure({
    device,
    format,
  });

  const pipeline = device.createRenderPipeline({
    vertex: {
      module: device.createShaderModule({
        code: shader,
      }),
      entryPoint: "vs_main",
    },
    fragment: {
      module: device.createShaderModule({
        code: shader,
      }),
      entryPoint: "fs_main",
      targets: [{ format: format }],
    },
    primitive: {
      topology: "triangle-list",
    },
    layout: device.createPipelineLayout({ bindGroupLayouts: [] }),
  }) as GPURenderPipeline;

  const commandEncoder = device.createCommandEncoder();
  const textureView = context
    .getCurrentTexture()
    .createView() as GPUTextureView;
  const renderpass = commandEncoder.beginRenderPass({
    colorAttachments: [
      {
        view: textureView,
        clearValue: { r: 0.5, g: 0.0, b: 0.25, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });

  renderpass.setPipeline(pipeline);
  renderpass.draw(3, 1, 0, 0);
  renderpass.end();

  device.queue.submit([commandEncoder.finish()]);
};

Initialize();
