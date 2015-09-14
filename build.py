import sys

try:
    xpi = sys.argv[1]
except:
    from xml.dom.minidom import parse
    dom = parse("install.rdf")
    id = dom.getElementsByTagName("em:id")[0].firstChild.nodeValue
    version = dom.getElementsByTagName("em:version")[0].firstChild.nodeValue
    dom.unlink()
    xpi = "{}-{}.xpi".format(id, version)

from subprocess import call
call("zip" + " -r " + xpi + " *", shell=True)
