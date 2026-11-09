import bpy, pathlib,json
from mathutils import Vector
root=pathlib.Path(__file__).resolve().parents[1]
out=root/'public/assets/devices';out.mkdir(parents=True,exist_ok=True)
report={}
for key,display,ancestor in [('pro','EHjrGDHNHzgNjtE.001','wUOhcMgiBmCgGaw'),('duo','hhgAIoCGsHXeDPY',None),('macbook','KJOApUlsdnUcfAE',None)]:
 bpy.ops.wm.open_mainfile(filepath=str(root/'source-assets/devices'/f'{key}.blend'))
 screen=bpy.data.objects[display]
 meshes=[o for o in bpy.context.scene.objects if o.type=='MESH' and (not ancestor or o in bpy.data.objects[ancestor].children_recursive)]
 report[key]={'objects':len(meshes),'hidden':[(o.name,o.hide_render,o.hide_viewport) for o in meshes if o.hide_render or o.hide_viewport]}
 # Bake existing assembly transforms; the original meshes and their UVs are retained.
 keep=[]
 for o in meshes:
  if o.hide_render:continue
  if o.name=='lJPfQMFXvvcmdtA':continue # USD presentation bounds, not device geometry.
  world=o.matrix_world.copy();o.parent=None;o.matrix_world=world
  keep.append(o)
 for o in list(bpy.context.scene.objects):
  if o not in keep:bpy.data.objects.remove(o,do_unlink=True)
 screen.name='DeviceScreen'
 # Screen UVs are mapped directly to the supplied screenshot, using the original display surface.
 if key in ['pro','duo']:
  coords=[screen.matrix_world@v.co for v in screen.data.vertices]
  # Original UV handles the model's rounded corners and slight presentation tilt.
  report[key]['uv_samples']=[{'co':list(coords[loop.vertex_index]),'uv':list(screen.data.uv_layers.active.data[i].uv)} for i,loop in enumerate(screen.data.loops) if i%max(1,len(screen.data.loops)//8)==0]
 mat=screen.data.materials[0];mat.name='DeviceScreenMaterial'
 for im in bpy.data.images:
  if im.source=='FILE' and im.size[0]>0:
   if im.file_format not in ['PNG','JPEG']:im.file_format='PNG'
   im.pack()
 bpy.ops.object.select_all(action='SELECT')
 bpy.ops.export_scene.gltf(filepath=str(out/f'{key}.glb'),export_format='GLB',use_selection=True,export_animations=False,export_yup=True,export_image_format='AUTO',export_cameras=False,export_lights=False)
 report[key]['bytes']=(out/f'{key}.glb').stat().st_size
(root/'design-review/export-report.json').write_text(json.dumps(report,indent=2))
print('EXPORT SUMMARY',json.dumps(report))
