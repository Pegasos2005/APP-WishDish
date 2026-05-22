package com.wishdish.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
public class UsuarioTestController {

    @Autowired
    private UsuarioTestRepository repository;

    @GetMapping
    public List<UsuarioTest> obtenerTodos() {
        return repository.findAll();
    }

    @PostMapping
    public UsuarioTest guardar(@RequestBody UsuarioTest usuario) {
        return repository.save(usuario);
    }
}